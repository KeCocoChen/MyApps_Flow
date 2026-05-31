import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Avatar3D({ size = 200 }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const w = size;
    const h = size;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(w, h);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xd8d8d8);
    scene.fog = new THREE.Fog(0xd8d8d8, 8, 18);

    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 50);
    camera.position.set(0, 1.8, 5.5);
    camera.lookAt(0, 1, 0);

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambient);
    const sun = new THREE.DirectionalLight(0xfff4e0, 1.2);
    sun.position.set(3, 5, 4);
    sun.castShadow = true;
    sun.shadow.mapSize.set(512, 512);
    scene.add(sun);
    const fill = new THREE.DirectionalLight(0xaaccff, 0.4);
    fill.position.set(-3, 2, -2);
    scene.add(fill);

    // ---- Room ----
    const roomMat = new THREE.MeshLambertMaterial({ color: 0xe8e8e8 });
    const floorMat = new THREE.MeshLambertMaterial({ color: 0xc8bfb0 });

    // Floor
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Back wall
    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(10, 6), roomMat);
    backWall.position.set(0, 3, -5);
    scene.add(backWall);

    // Left wall
    const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(10, 6), roomMat);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-5, 3, 0);
    scene.add(leftWall);

    // Skirting board
    const skirtMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const skirt = new THREE.Mesh(new THREE.BoxGeometry(10, 0.12, 0.05), skirtMat);
    skirt.position.set(0, 0.06, -4.97);
    scene.add(skirt);

    // Simple couch
    const couchMat = new THREE.MeshLambertMaterial({ color: 0x8a7a6a });
    const couchBase = new THREE.Mesh(new THREE.BoxGeometry(3, 0.5, 1), couchMat);
    couchBase.position.set(0, 0.25, -3.8);
    couchBase.castShadow = true;
    scene.add(couchBase);
    const couchBack = new THREE.Mesh(new THREE.BoxGeometry(3, 0.7, 0.2), couchMat);
    couchBack.position.set(0, 0.75, -4.25);
    scene.add(couchBack);
    // Couch cushions
    const cushionMat = new THREE.MeshLambertMaterial({ color: 0x7a6a5a });
    [-0.9, 0, 0.9].forEach(x => {
      const c = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.18, 0.85), cushionMat);
      c.position.set(x, 0.54, -3.8);
      scene.add(c);
    });

    // Coffee table
    const tableMat = new THREE.MeshLambertMaterial({ color: 0x5c4a3a });
    const tableTop = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.06, 0.6), tableMat);
    tableTop.position.set(0, 0.4, -2.5);
    scene.add(tableTop);
    [[0.5, 0.5], [-0.5, 0.5], [0.5, -0.2], [-0.5, -0.2]].forEach(([x, z]) => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.38), tableMat);
      leg.position.set(x * 0.9, 0.19, -2.5 + z * 0.5);
      scene.add(leg);
    });

    // Picture frame on wall
    const frameMat = new THREE.MeshLambertMaterial({ color: 0x3a3a3a });
    const frame = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.9, 0.05), frameMat);
    frame.position.set(1.5, 2.5, -4.95);
    scene.add(frame);
    const painting = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.7, 0.02), new THREE.MeshLambertMaterial({ color: 0x7ab0d4 }));
    painting.position.set(1.5, 2.5, -4.92);
    scene.add(painting);

    // ---- Cute Character ----
    const skinColor = 0xffd5b0;
    const hairColor = 0x3a2818;
    const clothColor = 0x6c63ff;
    const pantsColor = 0x2a4a8a;
    const shoeColor = 0x222222;

    const charGroup = new THREE.Group();
    scene.add(charGroup);
    charGroup.position.set(0, 0, 0);

    const skinMat = new THREE.MeshPhongMaterial({ color: skinColor, shininess: 20 });
    const hairMat = new THREE.MeshPhongMaterial({ color: hairColor });
    const clothMat = new THREE.MeshPhongMaterial({ color: clothColor });
    const pantsMat = new THREE.MeshPhongMaterial({ color: pantsColor });
    const shoeMat = new THREE.MeshPhongMaterial({ color: shoeColor });

    // Head - big and round for cuteness
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.42, 32, 32), skinMat);
    head.position.y = 1.72;
    head.castShadow = true;
    charGroup.add(head);

    // Hair
    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.44, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.52), hairMat);
    hair.position.y = 1.72;
    hair.rotation.x = 0.08;
    charGroup.add(hair);

    // Cute big eyes
    const eyeWhiteMat = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const eyePupilMat = new THREE.MeshPhongMaterial({ color: 0x111111 });
    const eyeShine = new THREE.MeshPhongMaterial({ color: 0xffffff, emissive: 0xffffff });
    [-0.16, 0.16].forEach(x => {
      // White
      const white = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), eyeWhiteMat);
      white.position.set(x, 1.75, 0.38);
      white.scale.set(1, 1.1, 0.7);
      charGroup.add(white);
      // Pupil
      const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.065, 16, 16), eyePupilMat);
      pupil.position.set(x, 1.76, 0.43);
      charGroup.add(pupil);
      // Shine dot
      const shine = new THREE.Mesh(new THREE.SphereGeometry(0.022, 8, 8), eyeShine);
      shine.position.set(x + 0.03, 1.8, 0.48);
      charGroup.add(shine);
    });

    // Rosy cheeks
    const blushMat = new THREE.MeshPhongMaterial({ color: 0xffb3b3, transparent: true, opacity: 0.5 });
    [-0.28, 0.28].forEach(x => {
      const blush = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), blushMat);
      blush.position.set(x, 1.65, 0.38);
      blush.scale.set(1, 0.6, 0.4);
      charGroup.add(blush);
    });

    // Smile
    const smileMat = new THREE.MeshPhongMaterial({ color: 0xcc5555 });
    const smileMesh = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.018, 8, 12, Math.PI), smileMat);
    smileMesh.position.set(0, 1.59, 0.42);
    smileMesh.rotation.z = Math.PI;
    charGroup.add(smileMesh);

    // Neck
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.18, 16), skinMat);
    neck.position.y = 1.31;
    charGroup.add(neck);

    // Body (torso)
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.28, 0.7, 16), clothMat);
    body.position.y = 0.95;
    body.castShadow = true;
    charGroup.add(body);

    // Arms
    const leftArm = new THREE.Group();
    const rightArm = new THREE.Group();
    const armMesh = (side) => {
      const upper = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.38, 12), clothMat);
      upper.position.y = -0.19;
      const lower = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.06, 0.35, 12), skinMat);
      lower.position.y = -0.56;
      const hand = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), skinMat);
      hand.position.y = -0.76;
      const g = new THREE.Group();
      g.add(upper); g.add(lower); g.add(hand);
      g.position.set(side * 0.36, 1.25, 0);
      g.rotation.z = side * 0.15;
      return g;
    };
    charGroup.add(armMesh(-1));
    charGroup.add(armMesh(1));
    const leftArmGroup = armMesh(-1);
    const rightArmGroup = armMesh(1);
    // We already added simple arms, replace with animated ones
    charGroup.remove(charGroup.children[charGroup.children.length - 1]);
    charGroup.remove(charGroup.children[charGroup.children.length - 1]);

    const lArm = new THREE.Group();
    lArm.position.set(-0.36, 1.25, 0);
    const lArmUpper = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.38, 12), clothMat);
    lArmUpper.position.y = -0.19;
    const lArmLower = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.06, 0.35, 12), skinMat);
    lArmLower.position.y = -0.56;
    const lHand = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), skinMat);
    lHand.position.y = -0.76;
    lArm.add(lArmUpper); lArm.add(lArmLower); lArm.add(lHand);
    charGroup.add(lArm);

    const rArm = new THREE.Group();
    rArm.position.set(0.36, 1.25, 0);
    const rArmUpper = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.38, 12), clothMat);
    rArmUpper.position.y = -0.19;
    const rArmLower = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.06, 0.35, 12), skinMat);
    rArmLower.position.y = -0.56;
    const rHand = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), skinMat);
    rHand.position.y = -0.76;
    rArm.add(rArmUpper); rArm.add(rArmLower); rArm.add(rHand);
    charGroup.add(rArm);

    // Hips
    const hips = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.22, 0.22, 16), pantsMat);
    hips.position.y = 0.59;
    charGroup.add(hips);

    // Legs
    const lLeg = new THREE.Group();
    lLeg.position.set(-0.14, 0.58, 0);
    const lThigh = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.09, 0.42, 12), pantsMat);
    lThigh.position.y = -0.21;
    const lShin = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.38, 12), pantsMat);
    lShin.position.y = -0.59;
    const lShoe = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.1, 0.28), shoeMat);
    lShoe.position.set(0, -0.82, 0.05);
    lLeg.add(lThigh); lLeg.add(lShin); lLeg.add(lShoe);
    charGroup.add(lLeg);

    const rLeg = new THREE.Group();
    rLeg.position.set(0.14, 0.58, 0);
    const rThigh = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.09, 0.42, 12), pantsMat);
    rThigh.position.y = -0.21;
    const rShin = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.38, 12), pantsMat);
    rShin.position.y = -0.59;
    const rShoe = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.1, 0.28), shoeMat);
    rShoe.position.set(0, -0.82, 0.05);
    rLeg.add(rThigh); rLeg.add(rShin); rLeg.add(rShoe);
    charGroup.add(rLeg);

    let t = 0;
    const walkSpeed = 2.2;

    const animate = () => {
      const id = requestAnimationFrame(animate);
      renderer.domElement._animId = id;
      t += 0.016;

      // Walking leg swing
      const legSwing = Math.sin(t * walkSpeed) * 0.45;
      lLeg.rotation.x = legSwing;
      rLeg.rotation.x = -legSwing;

      // Arm swing opposite to legs
      lArm.rotation.x = -legSwing * 0.6;
      rArm.rotation.x = legSwing * 0.6;

      // Body bob
      charGroup.position.y = Math.abs(Math.sin(t * walkSpeed)) * 0.04;

      // Gentle body sway
      charGroup.rotation.y = Math.sin(t * 0.4) * 0.12;

      // Head slight nod
      head.rotation.y = Math.sin(t * 0.4) * 0.08;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(renderer.domElement._animId);
      renderer.dispose();
      if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [size]);

  return <div ref={mountRef} style={{ width: size, height: size, borderRadius: '16px', overflow: 'hidden' }} />;
}