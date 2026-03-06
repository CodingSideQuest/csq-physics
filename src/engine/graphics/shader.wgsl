

// Uniforms
struct Globals {
    resolution: vec2<f32>,
};

@group(0) @binding(0) var<uniform> globals: Globals;




struct VertexIn {
    // Vertex
    @location(0) vertexPosition: vec2<f32>,
    
    // Instance
    @location(1) instancePosition: vec2<f32>,
    @location(2) instanceRadius: f32,
    @location(3) instanceColor: vec3<f32>,
};

struct VertexOut {
    @builtin(position) clipPosition: vec4<f32>,
    @location(0) vertexPosition: vec2<f32>,
    @location(1) instanceColor: vec3<f32>,
};

@vertex 
fn vs_main(in: VertexIn) -> VertexOut {
    var out: VertexOut;

    let worldPosition = in.instancePosition + in.vertexPosition * in.instanceRadius;
    let clipPosition = worldPosition / globals.resolution * 2.0;

    out.clipPosition = vec4<f32>(clipPosition, 0.0, 1.0);
    out.vertexPosition = in.vertexPosition;
    out.instanceColor = in.instanceColor;
    return out;
}

@fragment 
fn fs_main(in: VertexOut) -> @location(0) vec4f {
    if (dot(in.vertexPosition, in.vertexPosition) > 1.0) {
        return vec4<f32>(0.0, 0.0, 0.0, 0.0);
    }

    return vec4<f32>(in.instanceColor, 1.0);
}