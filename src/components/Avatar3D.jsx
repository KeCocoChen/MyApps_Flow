import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Avatar3D({ size = 160 }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const w = size;
    const h = size;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100);
    camera.position.set(0, 0.5, 4.5);

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);
    const dir = new THREE.DirectionalLight(0xffffff, 1.2);
    dir.position.set(2, 4, 3);
    scene.add(dir);
    const fill = new THREE.DirectionalLight(0x8888ff, 0.4);
    fill.position.set(-2, -1, 2);
    scene.add(fill);

    // Avatar group
    const avatar = new THREE.Group();
    scene.add(avatar);

    // Head
    const headGeo = new THREE.SphereGeometry(0.55, 32, 32);
    const skinMat = new THREE.MeshPhongMaterial({ color: 0xf5c5a3, shininess: 30 });
    const head = new THREE.Mesh(headGeo, skinMat);
    head.position.y = 1.5;
    avatar.add(head);

    // Hair
    const hairGeo = new THREE.SphereGeometry(0.57, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.55);
    const hairMat = new THREE.MeshPhongMaterial({ color: 0x3d2b1f, side: THREE.FrontSide });
    const hair = new THREE.Mesh(hairGeo, hairMat);
    hair.position.y = 1.5;
    hair.rotation.x = 0.1;
    avatar.add(hair);

    // Eyes
    const eyeGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const eyeMat = new THREE.MeshPhongMaterial({ color: 0x222222 });
    [-0.2, 0.2].forEach(x => {
      const eye = new THREE.Mesh(eyeGeo, eyeMat);
      eye.position.set(x, 1.55, 0.5);
      avatar.add(eye);
    });

    // Smile
    const smileCurve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(-0.18, 1.3, 0.5),
      new THREE.Vector3(0, 1.22, 0.52),
      new THREE.Vector3(0.18, 1.3, 0.5)
    );
    const smilePoints = smileCurve.getPoints(12);
    const smileGeo = new THREE.BufferGeometry().setFromPoints(smilePoints);
    const smileMat = new THREE.LineBasicMaterial({ color: 0x884444, linewidth: 2 });
    avatar.add(new THREE.Line(smileGeo, smileMat));

    // Body
    const bodyGeo = new THREE.CylinderGeometry(0.42, 0.48, 1.1, 32);
    const bodyMat = new THREE.MeshPhongMaterial({ color: 0x6c63ff, shininess: 20 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.45;
    avatar.add(body);

    // Neck
    const neckGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.22, 16);
    const neck = new THREE.Mesh(neckGeo, skinMat);
    neck.position.y = 1.02;
    avatar.add(neck);

    // Arms
    [-1, 1].forEach(side => {
      const armGeo = new THREE.CylinderGeometry(0.12, 0.1, 0.9, 16);
      const arm = new THREE.Mesh(armGeo, new THREE.MeshPhongMaterial({ color: 0x6c63ff }));
      arm.position.set(side * 0.62, 0.55, 0);
      arm.rotation.z = side * 0.25;
      avatar.add(arm);
    });

    // Floating particles
    const particles = [];
    for (let i = 0; i < 8; i++) {
      const pGeo = new THREE.SphereGeometry(0.04, 8, 8);
      const pMat = new THREE.MeshPhongMaterial({ color: new THREE.Color().setHSL(i / 8, 0.9, 0.65) });
      const p = new THREE.Mesh(pGeo, pMat);
      const angle = (i / 8) * Math.PI * 2;
      p.userData = { angle, radius: 1.1 + Math.random() * 0.3, speed: 0.5 + Math.random() * 0.5, yOffset: (Math.random() - 0.5) * 0.6 };
      avatar.add(p);
      particles.push(p);
    }

    let t = 0;
    const animate = () => {
      const id = requestAnimationFrame(animate);
      renderer.domElement._animId = id;
      t += 0.016;

      // Bob up and down
      avatar.position.y = Math.sin(t * 1.2) * 0.08;
      // Slight rotation
      avatar.rotation.y = Math.sin(t * 0.6) * 0.3;

      // Arm wave
      avatar.children.forEach(child => {
        if (child.userData?.angle !== undefined) {
          const d = child.userData;
          d.angle += d.speed * 0.016;
          child.position.set(
            Math.cos(d.angle) * d.radius,
            1.1 + d.yOffset + Math.sin(d.angle * 2) * 0.15,
            Math.sin(d.angle) * d.radius
          );
        }
      });

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