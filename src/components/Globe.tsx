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
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { feature } from 'topojson-client';
import { useRouter } from 'next/router';

// City coordinates - adding extra info for debugging
const LOCATIONS = [
  { id: 'sf', name: 'San Francisco', lat: 37.7749, lng: -122.4194, url: '/SanFrancisco' },
  { id: 'ny', name: 'New York', lat: 40.7128, lng: -74.0060, url: '/NewYork' },
  { id: 'chi', name: 'Chicago', lat: 41.8781, lng: -87.6298, url: '/Chicago' }
];

const Globe = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Function to handle navigation to city pages
  const navigateToCity = (cityId: string) => {
    console.log(`Navigating to city: ${cityId}`);
    const city = LOCATIONS.find(loc => loc.id === cityId);
    if (city) {
      router.push(city.url);
    }
  };
  
  // Add keyboard shortcuts for navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === '1') {
        navigateToCity('sf');
      } else if (event.key === '2') {
        navigateToCity('ny');
      } else if (event.key === '3') {
        navigateToCity('chi');
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [router]);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Clear any existing content
    while (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild);
    }

    // Set up scene
    const scene = new Scene();
    scene.background = new Color('#000000'); // Pure black background
    
    // Set up WebGL renderer
    const renderer = new WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);
    
    // Set up CSS renderer for HTML elements
    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0px';
    labelRenderer.domElement.style.pointerEvents = 'none'; // Important: Allow pointer events to pass through to the WebGL canvas
    containerRef.current.appendChild(labelRenderer.domElement);
    
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
    
    // Add HTML elements as clickable buttons for San Francisco and New York
    globe
      .htmlElementsData(LOCATIONS)
        // @ts-ignore
      .htmlLat(d => d.lat)
        // @ts-ignore
      .htmlLng(d => d.lng)
      .htmlAltitude(0.1)
      .htmlElement(d => {
        const el = document.createElement('div');
        // @ts-ignore
        el.innerHTML = `<button style=" background-color: #ff5566; color: white; border: none; border-radius: 20px; padding: 8px 16px; font-weight: bold; cursor: pointer; box-shadow: 0 2px 5px rgba(0,0,0,0.3); pointer-events: auto;">${d.name}</button>`;
        
        // Add click event with stopPropagation to prevent globe dragging
        const button = el.querySelector('button');
        if (button) {
          button.addEventListener('click', (event) => {
            event.stopPropagation();
            // @ts-ignore
            console.log(`Button clicked for ${d.name} (${d.id}), navigating to: ${d.url}`);
            // @ts-ignore
            navigateToCity(d.id);
          });
        }
        
        return el;
      });
      
    // Add rings to highlight the locations
    // @ts-ignore
    globe
      .ringsData(LOCATIONS)
        // @ts-ignore
      .ringLat(d => d.lat)
        // @ts-ignore
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
              // @ts-ignore
              if (current.__globeObjType === 'label' && current.__data) {
                // Found a label, navigate to its URL
                // @ts-ignore
                const locationData = LOCATIONS.find(loc => loc.lat === current.__data.lat && loc.lng === current.__data.lng);
                
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
      labelRenderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Set initial view to focus on the United States
    // Fixed coordinates for a good view of the continental US
    const centerLat = 39.5;  // Middle of the US (approximately)
    const centerLng = -98.0; // Middle of the US (approximately)
    
    // Convert coordinates to 3D position
    const phi = (90 - centerLat) * (Math.PI / 180);
    const theta = (centerLng + 180) * (Math.PI / 180);
    const radius = 280; // Pull back camera to see the entire US
    
    // Position camera to look at the center of the United States
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
      labelRenderer.render(scene, camera); // Render HTML elements
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
        containerRef.current.removeChild(labelRenderer.domElement);
      }
      
      controls.dispose();
    };
  }, []);
  
  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
};

export default Globe; 