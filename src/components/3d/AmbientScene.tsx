"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function AmbientScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Particle field
    const particleCount = 120;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const cyanColor = new THREE.Color("#00F0FF");
    const blueColor = new THREE.Color("#38BDF8");
    const darkBlue = new THREE.Color("#1E3A8A");

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40;

      const mixedColor = i % 3 === 0 ? cyanColor : i % 3 === 1 ? blueColor : darkBlue;
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Add 2 subtle floating geometric wireframe polyhedrons
    const polyGeo = new THREE.IcosahedronGeometry(3.5, 0);
    const polyMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });

    const mesh1 = new THREE.Mesh(polyGeo, polyMat);
    mesh1.position.set(-18, 10, -10);
    scene.add(mesh1);

    const mesh2 = new THREE.Mesh(polyGeo, polyMat.clone());
    mesh2.position.set(20, -12, -15);
    scene.add(mesh2);

    let animationFrameId: number;
    let mouseX = 0;
    let mouseY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", onMouseMove);

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", onResize);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      particles.rotation.y += 0.0006;
      particles.rotation.x += 0.0003;

      mesh1.rotation.x += 0.003;
      mesh1.rotation.y += 0.004;

      mesh2.rotation.x -= 0.002;
      mesh2.rotation.y -= 0.003;

      // Subtle parallax camera drift
      camera.position.x += (mouseX * 2 - camera.position.x) * 0.02;
      camera.position.y += (mouseY * 2 - camera.position.y) * 0.02;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      polyGeo.dispose();
      polyMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-60"
      aria-hidden="true"
    />
  );
}
