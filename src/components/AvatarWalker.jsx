import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function AvatarWalker({ size = 120 }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const w = size;
    const h = size;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 50);
    camera.position.set(0, 1.4, 4.2);
    camera.lookAt(0, 0.9, 0);

    const ambient = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambient);
    const sun = new THREE.DirectionalLight(0xfff4e0, 1.0);
    sun.position.set(2, 4, 3);
    scene.add(sun);

    const skinMat = new THREE.MeshPhongMaterial({ color: 0xffd5b0, shininess: 20 });
    const hairMat = new THREE.MeshPhongMaterial({ color: 0x3a2818 });
    const clothMat = new THREE.MeshPhongMaterial({ color: 0x6c63ff });
    const pantsMat = new THREE.MeshPhongMaterial({ color: 0x2a4a8a });
    const shoeMat = new THREE.MeshPhongMaterial({ color: 0x222222 });

    const charGroup = new THREE.Group();
    scene.add(charGroup);

    // Head
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.38, 32, 32), skinMat);
    head.position.y = 1.6;
    charGroup.add(head);

    // Hair
    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.40, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.52), hairMat);
    hair.position.y = 1.6;
    charGroup.add(hair);

    // Eyes
    const eyeWhite = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const eyePupil = new THREE.MeshPhongMaterial({ color: 0x111111 });
    const eyeShine = new THREE.MeshPhongMaterial({ color: 0xffffff, emissive: 0xffffff });
    [-0.14, 0.14].forEach(x => {
      const w2 = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 16), eyeWhite);
      w2.position.set(x, 1.64, 0.35); w2.scale.set(1, 1.1, 0.7);
      charGroup.add(w2);
      const p = new THREE.Mesh(new THREE.SphereGeometry(0.058, 16, 16), eyePupil);
      p.position.set(x, 1.65, 0.39);
      charGroup.add(p);
      const s = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 8), eyeShine);
      s.position.set(x + 0.03, 1.68, 0.43);
      charGroup.add(s);
    });

    // Cheeks
    const blushMat = new THREE.MeshPhongMaterial({ color: 0xffb3b3, transparent: true, opacity: 0.5 });
    [-0.25, 0.25].forEach(x => {
      const b = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 12), blushMat);
      b.position.set(x, 1.55, 0.35); b.scale.set(1, 0.6, 0.4);
      charGroup.add(b);
    });

    // Smile
    const smileMat = new THREE.MeshPhongMaterial({ color: 0xcc5555 });
    const smile = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.016, 8, 12, Math.PI), smileMat);
    smile.position.set(0, 1.5, 0.39); smile.rotation.z = Math.PI;
    charGroup.add(smile);

    // Neck
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.11, 0.16, 16), skinMat);
    neck.position.y = 1.23;
    charGroup.add(neck);

    // Body
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.23, 0.25, 0.64, 16), clothMat);
    body.position.y = 0.88;
    charGroup.add(body);

    // Arms
    const lArm = new THREE.Group();
    lArm.position.set(-0.33, 1.15, 0);
    [new THREE.CylinderGeometry(0.07, 0.065, 0.34, 12), new THREE.CylinderGeometry(0.06, 0.055, 0.32, 12)].forEach((g, i) => {
      const mat = i === 0 ? clothMat : skinMat;
      const m = new THREE.Mesh(g, mat);
      m.position.y = i === 0 ? -0.17 : -0.51;
      lArm.add(m);
    });
    const lHand = new THREE.Mesh(new THREE.SphereGeometry(0.072, 12, 12), skinMat);
    lHand.position.y = -0.7; lArm.add(lHand);
    charGroup.add(lArm);

    const rArm = new THREE.Group();
    rArm.position.set(0.33, 1.15, 0);
    [new THREE.CylinderGeometry(0.07, 0.065, 0.34, 12), new THREE.CylinderGeometry(0.06, 0.055, 0.32, 12)].forEach((g, i) => {
      const mat = i === 0 ? clothMat : skinMat;
      const m = new THREE.Mesh(g, mat);
      m.position.y = i === 0 ? -0.17 : -0.51;
      rArm.add(m);
    });
    const rHand = new THREE.Mesh(new THREE.SphereGeometry(0.072, 12, 12), skinMat);
    rHand.position.y = -0.7; rArm.add(rHand);
    charGroup.add(rArm);

    // Hips
    const hips = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.2, 0.2, 16), pantsMat);
    hips.position.y = 0.55;
    charGroup.add(hips);

    // Legs
    const lLeg = new THREE.Group();
    lLeg.position.set(-0.12, 0.54, 0);
    [new THREE.CylinderGeometry(0.09, 0.08, 0.38, 12), new THREE.CylinderGeometry(0.075, 0.065, 0.34, 12)].forEach((g, i) => {
      const m = new THREE.Mesh(g, pantsMat);
      m.position.y = i === 0 ? -0.19 : -0.54;
      lLeg.add(m);
    });
    const lShoe = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.09, 0.25), shoeMat);
    lShoe.position.set(0, -0.75, 0.045); lLeg.add(lShoe);
    charGroup.add(lLeg);

    const rLeg = new THREE.Group();
    rLeg.position.set(0.12, 0.54, 0);
    [new THREE.CylinderGeometry(0.09, 0.08, 0.38, 12), new THREE.CylinderGeometry(0.075, 0.065, 0.34, 12)].forEach((g, i) => {
      const m = new THREE.Mesh(g, pantsMat);
      m.position.y = i === 0 ? -0.19 : -0.54;
      rLeg.add(m);
    });
    const rShoe = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.09, 0.25), shoeMat);
    rShoe.position.set(0, -0.75, 0.045); rLeg.add(rShoe);
    charGroup.add(rLeg);

    let t = 0;
    const walkSpeed = 2.2;
    const animate = () => {
      const id = requestAnimationFrame(animate);
      renderer.domElement._animId = id;
      t += 0.016;
      const swing = Math.sin(t * walkSpeed) * 0.42;
      lLeg.rotation.x = swing;
      rLeg.rotation.x = -swing;
      lArm.rotation.x = -swing * 0.6;
      rArm.rotation.x = swing * 0.6;
      charGroup.position.y = Math.abs(Math.sin(t * walkSpeed)) * 0.035;
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

  return <div ref={mountRef} style={{ width: size, height: size }} />;
}