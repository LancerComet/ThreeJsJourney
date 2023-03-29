// Reference:
// https://stackoverflow.com/questions/43621274/how-to-correctly-set-lighting-for-custom-shader-material

const fragmentShader = `
precision mediump float;

uniform sampler2D texture1;
uniform sampler2D texture2;

varying vec2 v_uv;
varying vec3 vecPos;
varying vec3 vecNormal;

uniform bool isLightEnabled;
uniform float lightIntensity;

#if NUM_POINT_LIGHTS > 0
struct PointLight {
  vec3 color;
  vec3 position; // light position, in camera coordinates
  float distance; // used for attenuation purposes. Since
                  // we're writing our own shader, it can
                  // really be anything we want (as long as
                  // we assign it to our light in its
                  // "distance" field
};

uniform PointLight pointLights[NUM_POINT_LIGHTS];
#endif

uniform vec3 ambientLightColor;

void main () {
  vec3 color;
  if (gl_FrontFacing) {
    color = texture2D(texture1, v_uv).rgb;
  } else {
    vec2 backUv = vec2(1.0 - v_uv.s, v_uv.t);
    color = texture2D(texture2, backUv).rgb;
  }

  vec4 addedLights = vec4(0.0, 0.0, 0.0, 1.0);

  if (isLightEnabled) {
    // Pretty basic lambertian lighting...
    for (int l = 0; l < NUM_POINT_LIGHTS; l++) {
      PointLight pointLight = pointLights[l];
      vec3 lightDirection = normalize(vecPos - pointLight.position);

      vec3 light = vec3(1, 1, 1);
      if (!gl_FrontFacing) {
        light = vec3(-1, -1, -1);
      }

      addedLights.rgb += clamp(dot(-lightDirection * light, vecNormal), 0.0, 1.0) *
        pointLights[l].color *
        (pointLight.distance / 100.0);
    }

    addedLights.rgb += ambientLightColor;
  } else {
    addedLights = vec4(1.0, 1.0, 1.0, 1.0);
  }

  gl_FragColor = vec4(color, 1.0) * addedLights;
}
`

const vertexShader = `
precision mediump float;

varying vec2 v_uv;
varying vec3 vecPos;
varying vec3 vecNormal;

void main() {
  v_uv = uv;

  // Since the light is in camera coordinates,
  // I'll need the vertex position in camera coords too
  vecPos = (modelViewMatrix * vec4(position, 1.0)).xyz;

  // That's NOT exactly how you should transform your
  // normals but this will work fine, since my model
  // matrix is pretty basic
  vecNormal = (modelViewMatrix * vec4(normal, 0.0)).xyz;
  gl_Position = projectionMatrix * vec4(vecPos, 1.0);
}
`

export {
  fragmentShader,
  vertexShader
}

// Three js injected uniforms and macros.
// =========================
// uniform vec3 ambientLightColor;
//
// #if NUM_DIR_LIGHTS > 0
// struct DirectionalLight {
//   vec3 direction;
//   vec3 color;
// };
// uniform DirectionalLight directionalLights[NUM_DIR_LIGHTS];
// #endif
//
// #if NUM_POINT_LIGHTS > 0
// struct PointLight {
//   vec3 color;
//   vec3 position;
//   vec3 decay;
//   vec3 distance;
// };
// uniform PointLight pointLights[NUM_POINT_LIGHTS];
// #endif

// #if NUM_POINT_LIGHTS > 0
// for (int i = 0; i < NUM_POINT_LIGHTS; i++) {
//   PointLight pointLight = pointLights[i];
//   vec3 color = pointLight.color;
//   vec3 position = pointLight.position;
//   vec3 decay = pointLight.decay;
//   vec3 distance = pointLight.distance;
//   // gl_FragColor.rgb = gl_FragColor.rgb * light;
// }
// #endif
