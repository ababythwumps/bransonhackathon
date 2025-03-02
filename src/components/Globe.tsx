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
  MeshPhongMaterial,
  Raycaster,
  Vector2,
  Object3D,
  Vector3
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { feature } from 'topojson-client';
import { useRouter } from 'next/router';

// SF and NY coordinates
const LOCATIONS = [
  { name: 'San Francisco', lat: 37.7749, lng: -122.4194, url: '/sanfrancisco' },
  { name: 'New York', lat: 40.7128, lng: -74.0060, url: '/newyork' }
];

const Globe = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Clear any existing content
    while (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild);
    }

    // Set up scene
    const scene = new Scene();
    scene.background = new Color('#000000'); // Pure black background
    
    // Set up renderer
    const renderer = new WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);
    
    // Set up camera
    const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 250;
    
    // Add lights
    const ambientLight = new AmbientLight(0xffffff, 0.5); // White light
    scene.add(ambientLight);
    
    const directionalLight = new DirectionalLight(0xffffff, 1); // Pure white light
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Create globe
    const globe = new ThreeGlobe()
      // Use a single solid color for the globe
      .showGlobe(true)
      .showAtmosphere(true)
      .atmosphereColor('#444444') // Dark gray atmosphere
      .atmosphereAltitude(0.15)
      .globeMaterial(
        // Create a solid color material
        new MeshPhongMaterial({ 
          color: '#222222', // Dark gray for globe
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
          .polygonStrokeColor(() => '#ffffff') // White country outlines
          .polygonAltitude(0.005); // Slightly raised to ensure visibility
      });
    
    // Add point of interest markers for San Francisco and New York
    globe
      .labelsData(LOCATIONS)
      .labelLat(d => d.lat)
      .labelLng(d => d.lng)
      .labelText(d => d.name)
      .labelColor(() => '#ff5566') // Bright pink/red highlight
      .labelAltitude(0.01)
      .labelSize(0.5)
      .labelDotRadius(0.4) // Larger dot for visibility
      .labelDotOrientation(() => 'bottom');
      
    // Add rings to highlight the locations
    globe
      .ringsData(LOCATIONS)
      .ringLat(d => d.lat)
      .ringLng(d => d.lng)
      .ringColor(() => '#ff5566')
      .ringMaxRadius(1.0)
      .ringPropagationSpeed(1)
      .ringRepeatPeriod(2000);

    scene.add(globe);
    
    // Add orbit controls for manual spinning with cursor
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08; // Smoother damping
    controls.rotateSpeed = 0.8; // Faster rotation for better responsiveness
    controls.enableZoom = true;
    controls.minDistance = 150;
    controls.maxDistance = 500;
    controls.autoRotate = false; // Explicitly disable auto-rotation
    
    // Set up raycaster for point detection
    const raycaster = new Raycaster();
    const pointer = new Vector2();
    
    // Track if user is dragging the globe
    let isDragging = false;
    let clickStartTime = 0;
    
    renderer.domElement.addEventListener('pointerdown', () => {
      isDragging = true;
      clickStartTime = Date.now();
    });
    
    renderer.domElement.addEventListener('pointerup', (event) => {
      // Only treat as a click if it was a quick interaction (less than 200ms)
      if (Date.now() - clickStartTime < 200) {
        // Get normalized device coordinates
        pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        // Cast a ray through the scene
        raycaster.setFromCamera(pointer, camera);
        
        // Find intersections with objects on the globe
        const intersects = raycaster.intersectObjects(globe.children, true);
        
        if (intersects.length > 0) {
          // Find the closest intersection that has label data
          for (const intersect of intersects) {
            let current = intersect.object;
            
            // Check if we clicked on a label or its dot
            while (current && current.parent) {
              if (current.__globeObjType === 'label' && current.__data) {
                // Found a label, navigate to its URL
                const locationData = LOCATIONS.find(loc => 
                  loc.lat === current.__data.lat && 
                  loc.lng === current.__data.lng
                );
                
                if (locationData) {
                  router.push(locationData.url);
                  break;
                }
              }
              
              current = current.parent;
            }
          }
        }
      }
      
      isDragging = false;
    });
    
    renderer.domElement.addEventListener('pointerout', () => {
      isDragging = false;
    });
    
    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Set initial view to focus on NY and SF area (roughly center point between them)
    // This will position the camera to show both cities
    const centerLat = (LOCATIONS[0].lat + LOCATIONS[1].lat) / 2;
    const centerLng = (LOCATIONS[0].lng + LOCATIONS[1].lng) / 2;
    
    // Convert coordinates to 3D position
    const phi = (90 - centerLat) * (Math.PI / 180);
    const theta = (centerLng + 180) * (Math.PI / 180);
    const radius = 250; // Match camera position distance
    
    // Position camera to look at the center point of NY and SF
    camera.position.x = -radius * Math.sin(phi) * Math.cos(theta);
    camera.position.y = radius * Math.cos(phi);
    camera.position.z = radius * Math.sin(phi) * Math.sin(theta);
    camera.lookAt(0, 0, 0);
    
    // Animation loop
    let frameId: number | null = null;
    
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      
      // No auto-rotation, removed the globe.rotation.y increment
      
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