
import { BallStore } from "../Ball"
import SHADER_CODE from "./shader.wgsl?raw"

const QUAD_VERTICES = new Float32Array([
    // triangle 1
    -1, -1,
     1, -1,
    -1,  1,
  
    // triangle 2
     1, -1,
     1,  1,
    -1,  1,
])



export class Renderer {

    private canvas: HTMLCanvasElement

    private device!: GPUDevice
    private context!: GPUCanvasContext
    private format!: GPUTextureFormat
    
    private shaderModule!: GPUShaderModule
    private pipeline!: GPURenderPipeline
    private vertexBuffer!: GPUBuffer
    private instanceBuffer!: GPUBuffer
    
    private ballStore: BallStore
    private lastCapacity: number = 0

    private bindGroup!: GPUBindGroup
    private uniformBuffer!: GPUBuffer



    constructor(canvas: HTMLCanvasElement, ballStore: BallStore) {
        this.canvas = canvas
        this.ballStore = ballStore
    }

    public async init() {
        await this.getGpuDevice()
        this.configureCanvas()
        this.loadShaders()
        this.configurePipeline()
        this.createBuffers()
        this.createBindGroup()
    }

    private async getGpuDevice() {
        const adapter = await navigator.gpu?.requestAdapter()
        const device = await adapter?.requestDevice()

        if (!device) {
            throw new Error("WebGPU not supported!")
        }

        this.device = device
    }

    private configureCanvas() {
        this.context = this.canvas.getContext("webgpu")!
        this.format = navigator.gpu.getPreferredCanvasFormat()
        
        this.context.configure({
            device: this.device,
            format: this.format,
            alphaMode: "opaque"
        })
    }

    private loadShaders() {
        this.shaderModule = this.device.createShaderModule({
            code: SHADER_CODE
        })
    }

    private configurePipeline() {

        // Per vertex buffer, for the quad
        const vertexBufferLayout: GPUVertexBufferLayout = {
            arrayStride: 2 * 4, // 2 floats
            stepMode: "vertex",
            attributes: [
                { shaderLocation: 0, offset: 0, format: "float32x2" },
            ]
        }

        // Per instance buffer, for instance data
        const instanceBufferLayout: GPUVertexBufferLayout = {
            arrayStride: 6 * 4, // 6 floats
            stepMode: "instance",
            attributes: [
                { shaderLocation: 1, offset: 0 * 4, format: "float32x2" },
                { shaderLocation: 2, offset: 2 * 4, format: "float32" },
                { shaderLocation: 3, offset: 3 * 4, format: "float32x3" },
            ]
        }

        this.pipeline = this.device.createRenderPipeline({
            layout: "auto",
            vertex: {
                module: this.shaderModule,
                entryPoint: "vs_main",
                buffers: [
                    vertexBufferLayout,
                    instanceBufferLayout,
                ]
            },
            fragment: {
                module: this.shaderModule,
                entryPoint: "fs_main",
                targets: [{ 
                    format: this.format,
                    blend: {
                        color: {
                            srcFactor: "src-alpha",
                            dstFactor: "one-minus-src-alpha",
                            operation: "add",
                        },
                        alpha: {
                            srcFactor: "one",
                            dstFactor: "one-minus-src-alpha",
                            operation: "add",
                        }
                    } 
                }]
            },
            primitive: {
                topology: "triangle-list",
            }
        })
    }

    private createInstanceBuffer() {
        this.instanceBuffer = this.device.createBuffer({
            size: this.ballStore.getRawData().byteLength * 4,
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
        })
    }

    private createBuffers() {
        this.vertexBuffer = this.device.createBuffer({
            size: QUAD_VERTICES.byteLength,
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
        })

        this.createInstanceBuffer()

        this.uniformBuffer = this.device.createBuffer({
            size: 2 * 4, // 2 floats
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        })
    }

    private createBindGroup() {
        const bindGroupLayout = this.pipeline.getBindGroupLayout(0);

        this.bindGroup = this.device.createBindGroup({
            layout: bindGroupLayout,
            entries: [
                {
                    binding: 0,
                    resource: { buffer: this.uniformBuffer },
                },
            ],
        })
    }

    private resizeCanvasToDisplaySize() {
        const dpr = window.devicePixelRatio || 1
        const { width, height } = this.canvas.getBoundingClientRect()
        this.canvas.width = width * dpr
        this.canvas.height = height * dpr
    }

    public render() {
        this.resizeCanvasToDisplaySize()
        const encoder = this.device.createCommandEncoder()

        const pass = encoder.beginRenderPass({
            colorAttachments: [{
                view: this.context.getCurrentTexture().createView(),
                clearValue: { r: 18 / 255, g: 20 / 255, b: 25 / 255, a: 1 },
                loadOp: "clear",
                storeOp: "store"
            }]
        })

        // Set Data
        this.device.queue.writeBuffer(this.vertexBuffer, 0, QUAD_VERTICES)

        // Make sure capacity of buffers are aligned
        if (this.lastCapacity !== this.ballStore.capacity()) {
            this.createInstanceBuffer()
            this.lastCapacity = this.ballStore.capacity()
        }
        this.device.queue.writeBuffer(this.instanceBuffer, 0, this.ballStore.getRawData())

        // Set uniform data
        this.device.queue.writeBuffer(this.uniformBuffer, 0, new Float32Array([ 
            // Resolution
            this.canvas.width / (window.devicePixelRatio || 1), this.canvas.height / (window.devicePixelRatio || 1)
        ]))

        pass.setPipeline(this.pipeline)
        pass.setVertexBuffer(0, this.vertexBuffer)
        pass.setVertexBuffer(1, this.instanceBuffer)
        pass.setBindGroup(0, this.bindGroup)
        pass.draw(6, this.ballStore.length())
        pass.end()

        this.device.queue.submit([encoder.finish()])
    }
}