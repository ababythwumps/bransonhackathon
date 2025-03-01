// Updated Globe component that renders a single-color globe with country polygon highlights
// The globe automatically rotates around the y-axis and shows country borders

import { useEffect, useRef } from 'react';
import ThreeGlobe from 'three-globe';
import { 
  WebGLRenderer, 
  Scene, 
  PerspectiveCamera, 
  AmbientLight, 
  DirectionalLight, 
  Color,
  MeshPhongMaterial
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { feature } from 'topojson-client';

const Globe = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Clear any existing content
    while (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild);
    }

    // Set up scene
    const scene = new Scene();
    scene.background = new Color('#0a0806'); // Very dark sepia background
    
    // Set up renderer
    const renderer = new WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);
    
    // Set up camera
    const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 250;
    
    // Add lights
    const ambientLight = new AmbientLight(0xf5e8c0, 0.6); // Warm sepia light
    scene.add(ambientLight);
    
    const directionalLight = new DirectionalLight(0xf8dfa1, 1); // Warm highlight light
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Create globe
    const globe = new ThreeGlobe()
      // Use a single solid color for the globe
      .showGlobe(true)
      .showAtmosphere(true)
      .atmosphereColor('#7a5c28') // Sepia atmosphere
      .atmosphereAltitude(0.18)
      .globeMaterial(
        // Create a solid color material
        new MeshPhongMaterial({ 
          color: '#402c12', // Darker sepia for globe
          transparent: true,
          opacity: 0.9
        })
      );
    
    // Load country polygon data
    fetch('//unpkg.com/world-atlas/countries-110m.json')
      .then(res => res.json())
      .then(countries => {
        // Use any type to bypass TypeScript checking for topojson structure
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const countriesData = feature(countries, (countries as any).objects.countries);
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        globe.polygonsData((countriesData as any).features);
        
        globe
          .polygonCapColor(() => 'rgba(0, 0, 0, 0)') // Transparent polygon caps
          .polygonSideColor(() => 'rgba(0, 0, 0, 0)') // Transparent polygon sides
          .polygonStrokeColor(() => '#d9b382') // Warm sepia country outlines
          .polygonAltitude(0.005); // Slightly raised to ensure visibility
      });
    
    scene.add(globe);
    
    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.rotateSpeed = 0.5;
    controls.enableZoom = true;
    controls.minDistance = 150;
    controls.maxDistance = 500;
    
    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Animation loop
    let frameId: number | null = null;
    
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      
      // Auto-rotate the globe
      globe.rotation.y += 0.002;
      
      controls.update();
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Cleanup
    return () => {
      if (frameId !== null) {
        cancelAnimationFrame(frameId);
      }
      
      window.removeEventListener('resize', handleResize);
      
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      controls.dispose();
    };
  }, []);
  
  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
};

export default Globe; 