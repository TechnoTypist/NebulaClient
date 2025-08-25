import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default function GLBPreviewModal({
  url,
  open,
  onClose,
}: {
  url?: string;
  open: boolean;
  onClose: () => void;
}) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open || !mountRef.current || !url) return;

    const mount = mountRef.current;
    const width = mount.clientWidth || 480;
    const height = mount.clientHeight || 360;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 1.6, 2.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    mount.appendChild(renderer.domElement);

    const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 1.0);
    scene.add(hemi);
    const dir = new THREE.DirectionalLight(0xffffff, 0.6);
    dir.position.set(5, 10, 7.5);
    scene.add(dir);

    let model: THREE.Object3D | null = null;
    const loader = new GLTFLoader();
    loader.load(
      url,
      (gltf) => {
        model = gltf.scene;
        const box = new THREE.Box3().setFromObject(model);
        const size = new THREE.Vector3();
        box.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z);
        if (maxDim > 0) model.scale.setScalar(1.2 / maxDim);
        scene.add(model);
      },
      undefined,
      (err) => console.error("GLTF load error:", err)
    );

    let frame = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      if (model) model.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, [open, url]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg max-w-3xl w-[90%] p-3">
        <div className="flex justify-end">
          <button onClick={onClose} className="px-3 py-1 rounded bg-gray-200">Close</button>
        </div>
        <div ref={mountRef} style={{ width: "100%", height: 420 }} />
      </div>
    </div>
  );
}
