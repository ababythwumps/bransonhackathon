import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

// Carbon footprint survey questions
const surveyQuestions = [
  // Transportation Section
  {
    id: 'transportation_commute',
    question: 'How do you primarily commute to work or school?',
    options: [
      { id: 'car_solo', text: 'Drive alone in a car', footprint: 4.6 },
      { id: 'carpool', text: 'Carpool', footprint: 2.2 },
      { id: 'public_transport', text: 'Public transportation', footprint: 1.5 },
      { id: 'bike', text: 'Bicycle', footprint: 0.1 },
      { id: 'walk', text: 'Walk', footprint: 0 },
      { id: 'wfh', text: 'Work from home', footprint: 0.3 }
    ]
  },
  {
    id: 'transportation_car_type',
    question: 'If you drive, what type of vehicle do you use most often?',
    options: [
      { id: 'suv_truck', text: 'SUV, truck, or large vehicle', footprint: 3.5 },
      { id: 'medium_car', text: 'Medium-sized car (sedan)', footprint: 2.5 },
      { id: 'small_car', text: 'Small car or compact', footprint: 1.8 },
      { id: 'hybrid', text: 'Hybrid vehicle', footprint: 1.3 },
      { id: 'electric', text: 'Electric vehicle', footprint: 0.8 },
      { id: 'no_car', text: "I don't drive", footprint: 0 }
    ]
  },
  {
    id: 'transportation_vehicle_age',
    question: 'If you drive, how old is your primary vehicle?',
    options: [
      { id: 'new', text: 'Less than 3 years old', footprint: 1.0 },
      { id: 'medium', text: '3-10 years old', footprint: 1.5 },
      { id: 'old', text: 'More than 10 years old', footprint: 2.0 },
      { id: 'no_car', text: "I don't drive", footprint: 0 }
    ]
  },
  {
    id: 'transportation_mileage',
    question: 'Approximately how many miles do you drive per year?',
    options: [
      { id: 'miles_0', text: "I don't drive", footprint: 0 },
      { id: 'miles_under_5000', text: 'Under 5,000 miles', footprint: 1.0 },
      { id: 'miles_5000_10000', text: '5,000 - 10,000 miles', footprint: 2.0 },
      { id: 'miles_10000_15000', text: '10,000 - 15,000 miles', footprint: 3.0 },
      { id: 'miles_over_15000', text: 'Over 15,000 miles', footprint: 4.5 }
    ]
  },
  
  // Diet and Food Section
  {
    id: 'diet_type',
    question: 'What best describes your diet?',
    options: [
      { id: 'meat_daily', text: 'Meat with most meals', footprint: 3.3 },
      { id: 'meat_weekly', text: 'Meat a few times per week', footprint: 2.5 },
      { id: 'pescatarian', text: 'Pescatarian (fish, no meat)', footprint: 1.9 },
      { id: 'vegetarian', text: 'Vegetarian', footprint: 1.7 },
      { id: 'vegan', text: 'Vegan', footprint: 1.5 }
    ]
  },
  {
    id: 'diet_beef',
    question: 'How often do you eat beef or lamb?',
    options: [
      { id: 'beef_daily', text: 'Daily', footprint: 4.0 },
      { id: 'beef_few_times_week', text: 'A few times per week', footprint: 2.8 },
      { id: 'beef_once_week', text: 'Once a week', footprint: 1.6 },
      { id: 'beef_few_times_month', text: 'A few times per month', footprint: 0.8 },
      { id: 'beef_rarely_never', text: 'Rarely or never', footprint: 0.2 }
    ]
  },
  {
    id: 'diet_dairy',
    question: 'How much dairy do you consume?',
    options: [
      { id: 'dairy_high', text: 'High amount (multiple servings daily)', footprint: 1.7 },
      { id: 'dairy_medium', text: 'Moderate amount (daily)', footprint: 1.2 },
      { id: 'dairy_low', text: 'Low amount (occasionally)', footprint: 0.6 },
      { id: 'dairy_none', text: 'None', footprint: 0 }
    ]
  },
  {
    id: 'food_local',
    question: 'How often do you eat locally-produced foods?',
    options: [
      { id: 'local_mostly', text: 'Mostly local and seasonal', footprint: 0.5 },
      { id: 'local_often', text: 'Often when available', footprint: 0.8 },
      { id: 'local_sometimes', text: 'Sometimes', footprint: 1.2 },
      { id: 'local_rarely', text: 'Rarely or never', footprint: 1.5 }
    ]
  },
  {
    id: 'food_waste',
    question: 'How much food do you typically waste?',
    options: [
      { id: 'waste_minimal', text: 'Minimal - I use almost everything', footprint: 0.2 },
      { id: 'waste_some', text: 'Some - I throw away food occasionally', footprint: 0.8 },
      { id: 'waste_moderate', text: 'Moderate - I regularly throw away leftovers', footprint: 1.4 },
      { id: 'waste_high', text: 'High - I frequently throw away unused food', footprint: 2.0 }
    ]
  },
  
  // Housing and Energy Section
  {
    id: 'housing_type',
    question: 'What type of housing do you live in?',
    options: [
      { id: 'house_large', text: 'Large house (>2000 sq ft)', footprint: 5.0 },
      { id: 'house_medium', text: 'Medium house (1500-2000 sq ft)', footprint: 3.5 },
      { id: 'house_small', text: 'Small house (<1500 sq ft)', footprint: 2.5 },
      { id: 'apartment', text: 'Apartment', footprint: 1.5 },
      { id: 'shared', text: 'Shared housing', footprint: 1.0 }
    ]
  },
  {
    id: 'household_size',
    question: 'How many people live in your household?',
    options: [
      { id: 'people_1', text: 'Just me', footprint: 1.0 },
      { id: 'people_2', text: '2 people', footprint: 0.7 },
      { id: 'people_3_4', text: '3-4 people', footprint: 0.5 },
      { id: 'people_5_plus', text: '5 or more people', footprint: 0.3 }
    ]
  },
  {
    id: 'housing_heating',
    question: 'What is the primary heating source for your home?',
    options: [
      { id: 'heating_oil', text: 'Oil', footprint: 2.5 },
      { id: 'heating_natural_gas', text: 'Natural gas', footprint: 1.8 },
      { id: 'heating_electric', text: 'Electricity', footprint: 1.5 },
      { id: 'heating_heat_pump', text: 'Heat pump', footprint: 0.8 },
      { id: 'heating_renewable', text: 'Renewable energy (solar, geothermal)', footprint: 0.2 }
    ]
  },
  {
    id: 'energy_source',
    question: 'Do you use renewable energy at home?',
    options: [
      { id: 'all_renewable', text: 'Yes, 100% renewable', footprint: 0.5 },
      { id: 'partial_renewable', text: 'Yes, partially renewable', footprint: 1.5 },
      { id: 'no_renewable', text: 'No renewable energy', footprint: 3.0 },
      { id: 'unsure', text: "I'm not sure", footprint: 2.0 }
    ]
  },
  {
    id: 'energy_efficiency',
    question: 'Have you implemented energy efficiency measures in your home?',
    options: [
      { id: 'efficiency_high', text: 'Extensive (efficient appliances, LED lighting, insulation, smart controls)', footprint: 0.5 },
      { id: 'efficiency_moderate', text: 'Moderate (some efficient appliances, some LEDs)', footprint: 1.2 },
      { id: 'efficiency_minimal', text: 'Minimal (few or no energy efficiency measures)', footprint: 2.0 },
      { id: 'efficiency_renter', text: "I'm a renter with limited control over my space", footprint: 1.5 }
    ]
  },
  
  // Travel and Mobility Section
  {
    id: 'flights_domestic',
    question: 'How many domestic flights (under 3 hours) do you take per year?',
    options: [
      { id: 'domestic_0', text: 'None', footprint: 0 },
      { id: 'domestic_1_2', text: '1-2', footprint: 0.8 },
      { id: 'domestic_3_5', text: '3-5', footprint: 1.5 },
      { id: 'domestic_6_plus', text: '6 or more', footprint: 2.5 }
    ]
  },
  {
    id: 'flights_international',
    question: 'How many long-distance or international flights do you take per year?',
    options: [
      { id: 'international_0', text: 'None', footprint: 0 },
      { id: 'international_1', text: '1', footprint: 1.5 },
      { id: 'international_2_3', text: '2-3', footprint: 3.0 },
      { id: 'international_4_plus', text: '4 or more', footprint: 5.0 }
    ]
  },
  
  // Consumption Habits
  {
    id: 'shopping_habits',
    question: 'How would you describe your shopping habits for non-food items?',
    options: [
      { id: 'shop_minimal', text: 'Minimal - I buy only what I need', footprint: 0.5 },
      { id: 'shop_moderate', text: 'Moderate - I occasionally buy new things', footprint: 1.2 },
      { id: 'shop_frequent', text: 'Frequent - I regularly buy new clothes, electronics, etc.', footprint: 2.5 },
      { id: 'shop_high', text: 'High consumption - I frequently shop for pleasure', footprint: 3.5 }
    ]
  },
  {
    id: 'clothes_habits',
    question: 'How do you primarily acquire clothing?',
    options: [
      { id: 'clothes_secondhand', text: 'Mostly secondhand or repurposed', footprint: 0.3 },
      { id: 'clothes_mix', text: 'Mix of new and secondhand', footprint: 0.8 },
      { id: 'clothes_new_sustainable', text: 'New but from sustainable brands', footprint: 1.0 },
      { id: 'clothes_new_conventional', text: 'New from conventional retailers', footprint: 1.5 },
      { id: 'clothes_new_fast', text: 'Frequently from fast fashion brands', footprint: 2.2 }
    ]
  },
  {
    id: 'electronics',
    question: 'How often do you replace your electronics (phones, computers, TVs)?',
    options: [
      { id: 'electronics_rarely', text: 'Rarely - I keep devices until they stop working', footprint: 0.5 },
      { id: 'electronics_occasionally', text: 'Occasionally - Every 4+ years', footprint: 1.0 },
      { id: 'electronics_regularly', text: 'Regularly - Every 2-3 years', footprint: 1.8 },
      { id: 'electronics_frequently', text: 'Frequently - I upgrade when new models release', footprint: 2.5 }
    ]
  },
  
  // Waste and Recycling
  {
    id: 'recycling',
    question: 'How consistently do you recycle?',
    options: [
      { id: 'recycle_always', text: 'Always - I recycle everything possible', footprint: 0.3 },
      { id: 'recycle_mostly', text: 'Mostly - I recycle most items', footprint: 0.6 },
      { id: 'recycle_sometimes', text: 'Sometimes - I recycle when convenient', footprint: 1.2 },
      { id: 'recycle_rarely', text: 'Rarely or never', footprint: 1.8 }
    ]
  },
  {
    id: 'compost',
    question: 'Do you compost your food and yard waste?',
    options: [
      { id: 'compost_always', text: 'Yes, consistently', footprint: 0.2 },
      { id: 'compost_sometimes', text: 'Sometimes', footprint: 0.7 },
      { id: 'compost_never', text: 'No', footprint: 1.0 }
    ]
  },
  {
    id: 'survey_end',
    question: 'Ready to see your carbon footprint results?',
    options: [
      { id: 'end_survey', text: 'END SURVEY AND SEE RESULTS NOW', footprint: 0 }
    ]
  },
  
  // Water Usage
  {
    id: 'water_usage',
    question: 'How would you describe your water usage habits?',
    options: [
      { id: 'water_very_low', text: 'Very low (short showers, water-saving fixtures, minimal outdoor water use)', footprint: 0.2 },
      { id: 'water_low', text: 'Low (conscious of water usage)', footprint: 0.6 },
      { id: 'water_average', text: 'Average', footprint: 1.0 },
      { id: 'water_high', text: 'High (long showers, frequent laundry, lawn watering)', footprint: 1.5 }
    ]
  },
  
  // Climate Knowledge
  {
    id: 'climate_knowledge',
    question: 'How would you rate your knowledge about climate change issues?',
    options: [
      { id: 'knowledge_expert', text: 'Expert level (professionally involved)', footprint: -0.3 },
      { id: 'knowledge_high', text: 'High (regularly follow climate news and research)', footprint: -0.2 },
      { id: 'knowledge_moderate', text: 'Moderate (basic understanding)', footprint: -0.1 },
      { id: 'knowledge_minimal', text: 'Minimal (limited awareness)', footprint: 0 }
    ]
  }
];

// Local actions to reduce carbon footprint
const localActions = [
  // Transportation
  {
    id: 'transportation_commute',
    title: 'Transportation',
    recommendations: [
      'Use MUNI or BART public transit whenever possible',
      'Join the SF Bicycle Coalition and use bike-friendly routes',
      'Consider an electric vehicle for your next car purchase',
      'Use Bay Area car sharing services for occasional car needs',
      'Take advantage of San Francisco\'s walkable neighborhoods',
      'Use ride-sharing for group trips rather than solo rides'
    ],
    localResources: [
      { name: 'SF MUNI', url: 'https://www.sfmta.com/' },
      { name: 'Bay Area Bike Share', url: 'https://www.baywheels.com/' },
      { name: 'SF Bicycle Coalition', url: 'https://sfbike.org/' },
      { name: 'Bay Area EV Charging Map', url: 'https://ev.pge.com/' }
    ]
  },
  
  // Diet and Food
  {
    id: 'diet_type',
    title: 'Diet & Food',
    recommendations: [
      'Shop at local farmers markets for seasonal produce',
      'Participate in Meatless Mondays or reduce meat consumption',
      'Support local community gardens',
      'Try plant-based restaurants in San Francisco',
      'Join a CSA (Community Supported Agriculture) program',
      'Reduce food waste through proper meal planning',
      'Try growing herbs or vegetables at home or in community plots'
    ],
    localResources: [
      { name: 'SF Farmers Markets', url: 'https://sfenvironment.org/farmers-markets' },
      { name: 'SF Community Gardens', url: 'https://sfrecpark.org/520/Community-Gardens' },
      { name: 'SF Food System Map', url: 'https://www.sffoodsystem.org/' },
      { name: 'Food Runners (food recovery)', url: 'https://www.foodrunners.org/' }
    ]
  },
  
  // Housing and Energy
  {
    id: 'housing_type',
    title: 'Housing & Energy',
    recommendations: [
      'Sign up for CleanPowerSF for renewable energy',
      'Get a free home energy audit through BayREN',
      'Install low-flow water fixtures to conserve water',
      'Properly sort waste into recycling, compost, and landfill',
      'Replace old appliances with energy-efficient models',
      'Improve home insulation to reduce heating needs',
      'Install smart thermostats to optimize energy usage',
      'Consider solar panels if you own your home'
    ],
    localResources: [
      { name: 'CleanPowerSF', url: 'https://www.cleanpowersf.org/' },
      { name: 'SF Environment - Energy', url: 'https://sfenvironment.org/energy' },
      { name: 'BayREN Home Energy Programs', url: 'https://www.bayren.org/homeowners' },
      { name: 'SFPUC Water Conservation', url: 'https://www.sfpuc.org/learning/conserve-water' }
    ]
  },
  
  // Waste Management
  {
    id: 'recycling',
    title: 'Waste & Recycling',
    recommendations: [
      'Learn SF\'s recycling and composting rules and follow them strictly',
      'Bring reusable bags, bottles, and containers when shopping',
      'Shop at zero-waste stores in San Francisco',
      'Participate in neighborhood clean-up events',
      'Donate usable items instead of discarding them',
      'Repair broken items instead of replacing them',
      'Use city compost collection for all food scraps and yard waste'
    ],
    localResources: [
      { name: 'Recology SF', url: 'https://www.recology.com/recology-san-francisco/' },
      { name: 'SF Zero Waste Program', url: 'https://sfenvironment.org/zero-waste' },
      { name: 'SF Recycles - What Goes Where', url: 'https://sfrecycles.org/' },
      { name: 'Repair Cafes in SF', url: 'https://www.repaircafe.org/locations/' }
    ]
  },
  
  // Shopping and Consumption
  {
    id: 'shopping_habits',
    title: 'Shopping & Consumption',
    recommendations: [
      'Shop at thrift stores and consignment shops',
      'Look for products with minimal packaging',
      'Support local, sustainable businesses',
      'Rent or borrow items you use infrequently',
      'Choose quality products that will last longer',
      'Research brands before purchasing to find sustainable options',
      'Join neighborhood buy-nothing or sharing groups'
    ],
    localResources: [
      { name: 'SF Sustainable Businesses', url: 'https://sfenvironment.org/green-businesses' },
      { name: 'Buy Nothing SF Groups', url: 'https://buynothingproject.org/find-a-group/' },
      { name: 'SF Library of Things', url: 'https://www.libraryofthings.org/' },
      { name: 'SF Tool Lending Library', url: 'https://sfpl.org/services/the-bridge-at-main/tool-lending-library' }
    ]
  },
  
  // Community Action
  {
    id: 'community',
    title: 'Community Action',
    recommendations: [
      'Join local climate action groups',
      'Volunteer for environmental restoration projects',
      'Attend city council meetings to advocate for climate policies',
      'Support local climate ballot initiatives',
      'Organize neighborhood sustainability efforts',
      'Educate others about climate change and sustainable practices',
      'Participate in community science programs'
    ],
    localResources: [
      { name: '350 Bay Area', url: 'https://350bayarea.org/' },
      { name: 'SF Climate Action Network', url: 'https://www.sfclimateaction.org/' },
      { name: 'Sunrise Movement Bay Area', url: 'https://www.sunrisebayarea.org/' },
      { name: 'SF Parks Alliance', url: 'https://www.sfparksalliance.org/volunteer' }
    ]
  }
];

export default function SanFranciscoAction() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [footprint, setFootprint] = useState<number | null>(null);
  const [highestImpactArea, setHighestImpactArea] = useState<string | null>(null);

  const handleAnswer = (questionId: string, option: any) => {
    const newAnswers = { ...answers, [questionId]: option };
    setAnswers(newAnswers);
    
    // If this is the final question (climate_knowledge), immediately show results
    if (questionId === 'climate_knowledge' || currentStep === surveyQuestions.length - 1) {
      calculateFootprint(newAnswers);
      return;
    }
    
    // Determine if we need to skip questions based on the answer
    let nextStep = currentStep + 1;
    
    // Skip car-related questions if the user doesn't drive
    if (questionId === 'transportation_commute' && 
        (option.id === 'walk' || option.id === 'bike' || option.id === 'public_transport' || option.id === 'wfh')) {
      // Skip next 3 questions about car type, car age, and mileage
      nextStep = currentStep + 4;
    }
    
    // Skip beef consumption question if the user is vegetarian or vegan
    if (questionId === 'diet_type' && 
        (option.id === 'vegetarian' || option.id === 'vegan')) {
      // Skip next question about beef consumption
      nextStep = currentStep + 2;
    }
    
    // Skip dairy consumption question if the user is vegan
    if (questionId === 'diet_type' && option.id === 'vegan') {
      // Skip next 2 questions about beef and dairy consumption
      nextStep = currentStep + 3;
    }
    
    // Check if this is the last question or we've skipped to beyond the last question
    if (nextStep >= surveyQuestions.length) {
      // Last question or beyond - calculate footprint and show results
      calculateFootprint(newAnswers);
    } else {
      // Move to next appropriate question
      setCurrentStep(nextStep);
    }
  };

  const calculateFootprint = (userAnswers: Record<string, any>) => {
    // Calculate total footprint
    let total = 0;
    let impacts: Record<string, number> = {};
    
    // Add up the footprint values from all answers
    Object.keys(userAnswers).forEach(questionId => {
      const option = userAnswers[questionId];
      total += option.footprint;
      impacts[questionId] = option.footprint;
    });
    
    // Find the highest impact area
    let highestImpact = { id: null as string | null, value: 0 };
    Object.keys(impacts).forEach(area => {
      const impactValue = impacts[area];
      if (impactValue !== undefined && impactValue > highestImpact.value) {
        highestImpact = { id: area, value: impactValue };
      }
    });
    
    setFootprint(total);
    setHighestImpactArea(highestImpact.id);
  };

  const resetSurvey = () => {
    setCurrentStep(0);
    setAnswers({});
    setFootprint(null);
    setHighestImpactArea(null);
  };

  // Render each step of the survey
  const renderSurvey = () => {
    if (currentStep < surveyQuestions.length && currentStep > 0) {
      const question = surveyQuestions[currentStep - 1];
      
      // Determine which section we're in for progress indicators
      let currentSection = "";
      let sectionColor = "rgba(255, 255, 255, 0.5)";
      
      if (currentStep <= 4) {
        currentSection = "TRANSPORTATION";
        sectionColor = "rgba(120, 210, 255, 0.5)"; // Light blue
      } else if (currentStep <= 9) {
        currentSection = "FOOD & DIET";
        sectionColor = "rgba(120, 255, 140, 0.5)"; // Light green
      } else if (currentStep <= 14) {
        currentSection = "HOUSING & ENERGY";
        sectionColor = "rgba(255, 220, 120, 0.5)"; // Light amber
      } else if (currentStep <= 16) {
        currentSection = "TRAVEL";
        sectionColor = "rgba(230, 120, 255, 0.5)"; // Light purple
      } else if (currentStep <= 19) {
        currentSection = "CONSUMPTION";
        sectionColor = "rgba(255, 150, 120, 0.5)"; // Light orange
      } else {
        currentSection = "WASTE & WATER";
        sectionColor = "rgba(120, 230, 255, 0.5)"; // Light teal
      }
      
      // Calculate survey progress
      const progress = Math.min((currentStep / 22) * 100, 100);
      
      return (
        <div style={{ 
          maxWidth: '700px', 
          margin: '0 auto',
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '40px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem'
          }}>
            <div style={{ 
              fontSize: '0.8rem',
              letterSpacing: '0.2em',
              color: sectionColor,
              fontWeight: 200
            }}>
              {currentSection}
            </div>
            <div style={{ 
              fontSize: '0.8rem',
              letterSpacing: '0.1em',
              opacity: 0.5 
            }}>
              {currentStep} of 22
            </div>
          </div>
          
          {/* Progress bar */}
          <div style={{
            width: '100%',
            height: '4px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            marginBottom: '2rem',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              left: 0,
              top: 0,
              height: '100%',
              width: `${progress}%`,
              backgroundColor: sectionColor,
              transition: 'width 0.3s ease'
            }}></div>
          </div>
          
          <h2 style={{ 
            fontWeight: 200,
            fontSize: '1.5rem',
            letterSpacing: '0.05em',
            marginTop: '0',
            marginBottom: '2rem'
          }}>
            {question?.question}
          </h2>
          
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '12px', 
            marginTop: '20px' 
          }}>
            {/* Special handling for specific questions - no options, just a Skip button */}
            {question?.id === 'climate_knowledge' || currentStep === surveyQuestions.length - 1 ? (
              <div style={{ width: '100%' }}>
                <button
                  onClick={() => {
                    // Instead of calculating footprint, just move to the next question
                    setCurrentStep(currentStep + 1);
                  }}
                  style={{
                    padding: '20px 24px',
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '0',
                    cursor: 'pointer',
                    textAlign: 'center',
                    fontSize: '1.1rem',
                    transition: 'all 0.3s ease',
                    color: 'white',
                    fontFamily: 'CaskaydiaMono, monospace',
                    fontWeight: 200,
                    letterSpacing: '0.05em',
                    marginTop: '20px',
                    width: '100%'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  SKIP QUESTION
                </button>
              </div>
            ) : (
              // Render normal answer options for all other questions
              question?.options.map(option => (
                <button
                  key={option.id}
                  onClick={() => {
                    // Special handling for the end survey question
                    if (question.id === 'survey_end') {
                      // Use both approaches to ensure it works:
                      // 1. Set step count high (which triggers results when rendering)
                      // 2. Directly calculate footprint
                      setCurrentStep(500);
                      calculateFootprint(answers);
                      return;
                    }
                    
                    // Store answer and move to next step
                    const newAnswers = { ...answers, [question.id]: option };
                    setAnswers(newAnswers);
                    
                    // Check if this is the second-to-last or last question
                    if (currentStep >= surveyQuestions.length - 2) {
                      // Call the calculateFootprint function with the newAnswers
                      calculateFootprint(newAnswers);
                    } else {
                      // For all other questions, just move to the next step
                      setCurrentStep(currentStep + 1);
                    }
                  }}
                  style={{
                    padding: question.id === 'survey_end' ? '24px' : '16px 24px',
                    backgroundColor: question.id === 'survey_end' ? 'rgba(120, 255, 140, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '0',
                    cursor: 'pointer',
                    textAlign: question.id === 'survey_end' ? 'center' : 'left',
                    fontSize: question.id === 'survey_end' ? '1.2rem' : '1rem',
                    fontWeight: question.id === 'survey_end' ? 'bold' : 200,
                    transition: 'all 0.2s ease',
                    color: 'white',
                    fontFamily: 'CaskaydiaMono, monospace',
                    letterSpacing: '0.03em',
                    marginTop: question.id === 'survey_end' ? '20px' : '0'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = question.id === 'survey_end' ? 'rgba(120, 255, 140, 0.3)' : 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.transform = 'translateX(5px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = question.id === 'survey_end' ? 'rgba(120, 255, 140, 0.2)' : 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  {option.text}
                </button>
              ))
            )}
          </div>
          
          <div style={{ 
            marginTop: '30px', 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '20px'
          }}>
            <button 
              onClick={() => setCurrentStep(currentStep > 1 ? currentStep - 1 : 0)}
              disabled={currentStep === 1}
              style={{
                padding: '10px 20px',
                backgroundColor: 'transparent',
                color: 'white',
                border: currentStep === 1 ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '0',
                cursor: currentStep === 1 ? 'default' : 'pointer',
                opacity: currentStep === 1 ? 0.3 : 1,
                fontFamily: 'CaskaydiaMono, monospace',
                fontWeight: 200,
                letterSpacing: '0.05em',
                fontSize: '0.8rem',
                textTransform: 'uppercase'
              }}
            >
              Previous
            </button>
            
            <button 
              onClick={() => setCurrentStep(currentStep + 1)}
              style={{
                padding: '10px 20px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '0',
                cursor: 'pointer',
                fontFamily: 'CaskaydiaMono, monospace',
                fontWeight: 200,
                letterSpacing: '0.05em',
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              Skip Question
            </button>
          </div>
        </div>
      );
    } else if (footprint !== null) {
      // Display results
      return renderResults();
    }
  };

  // Render survey results
  const renderResults = () => {
    // Get the relevant local actions based on highest impact area
    const relevantActions = localActions.find(action => action.id === highestImpactArea) || localActions[0];
    const otherActions = localActions.filter(action => action.id !== highestImpactArea);
    
    // Create chart data
    const categories = {
      transportation: 0,
      food: 0,
      housing: 0,
      travel: 0,
      consumption: 0,
      waste: 0
    };
    
    // Calculate footprint by category
    Object.keys(answers).forEach(questionId => {
      const option = answers[questionId];
      if (questionId.startsWith('transportation')) {
        categories.transportation += option.footprint;
      } else if (questionId.startsWith('diet') || questionId.startsWith('food')) {
        categories.food += option.footprint;
      } else if (questionId.startsWith('housing') || questionId.startsWith('energy') || questionId.startsWith('household')) {
        categories.housing += option.footprint;
      } else if (questionId.startsWith('flights')) {
        categories.travel += option.footprint;
      } else if (questionId.startsWith('shopping') || questionId.startsWith('clothes') || questionId.startsWith('electronics')) {
        categories.consumption += option.footprint;
      } else if (questionId.startsWith('recycling') || questionId.startsWith('compost') || questionId.startsWith('water')) {
        categories.waste += option.footprint;
      }
    });
    
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '48px',
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '48px 32px'
        }}>
          <div style={{
            fontSize: '0.8rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            opacity: 0.5,
            marginBottom: '8px'
          }}>
            Your Results
          </div>
          
          <h2 style={{
            fontWeight: 200,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontSize: '1.6rem',
            marginTop: '0',
            marginBottom: '2rem'
          }}>
            Carbon Footprint Analysis
          </h2>
          
          <div style={{ 
            fontSize: '5rem', 
            fontWeight: 200,
            letterSpacing: '0.05em', 
            color: 'white',
            margin: '1.5rem 0',
            fontFamily: 'CaskaydiaMono, monospace',
          }}>
            {footprint?.toFixed(1)}
          </div>
          <p style={{ 
            fontSize: '1rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            opacity: 0.7
          }}>
            tons of CO₂ per year
          </p>
          
          {/* Visual breakdown of carbon footprint */}
          <div style={{ margin: '40px auto', maxWidth: '100%' }}>
            <div style={{ marginBottom: '12px', textAlign: 'left', fontSize: '0.9rem' }}>Breakdown by Category:</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>Transportation</span>
                  <span>{categories.transportation.toFixed(1)} tons</span>
                </div>
                <div style={{ width: '100%', height: '12px', backgroundColor: 'rgba(255,255,255,0.1)' }}>
                  <div style={{ 
                    width: `${Math.min((categories.transportation / (footprint || 1)) * 100, 100)}%`, 
                    height: '100%', 
                    backgroundColor: 'rgba(120, 210, 255, 0.7)' 
                  }}></div>
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>Food & Diet</span>
                  <span>{categories.food.toFixed(1)} tons</span>
                </div>
                <div style={{ width: '100%', height: '12px', backgroundColor: 'rgba(255,255,255,0.1)' }}>
                  <div style={{ 
                    width: `${Math.min((categories.food / (footprint || 1)) * 100, 100)}%`, 
                    height: '100%', 
                    backgroundColor: 'rgba(120, 255, 140, 0.7)' 
                  }}></div>
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>Housing & Energy</span>
                  <span>{categories.housing.toFixed(1)} tons</span>
                </div>
                <div style={{ width: '100%', height: '12px', backgroundColor: 'rgba(255,255,255,0.1)' }}>
                  <div style={{ 
                    width: `${Math.min((categories.housing / (footprint || 1)) * 100, 100)}%`, 
                    height: '100%', 
                    backgroundColor: 'rgba(255, 220, 120, 0.7)' 
                  }}></div>
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>Travel</span>
                  <span>{categories.travel.toFixed(1)} tons</span>
                </div>
                <div style={{ width: '100%', height: '12px', backgroundColor: 'rgba(255,255,255,0.1)' }}>
                  <div style={{ 
                    width: `${Math.min((categories.travel / (footprint || 1)) * 100, 100)}%`, 
                    height: '100%', 
                    backgroundColor: 'rgba(230, 120, 255, 0.7)' 
                  }}></div>
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>Consumption</span>
                  <span>{categories.consumption.toFixed(1)} tons</span>
                </div>
                <div style={{ width: '100%', height: '12px', backgroundColor: 'rgba(255,255,255,0.1)' }}>
                  <div style={{ 
                    width: `${Math.min((categories.consumption / (footprint || 1)) * 100, 100)}%`, 
                    height: '100%', 
                    backgroundColor: 'rgba(255, 150, 120, 0.7)' 
                  }}></div>
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>Waste & Water</span>
                  <span>{categories.waste.toFixed(1)} tons</span>
                </div>
                <div style={{ width: '100%', height: '12px', backgroundColor: 'rgba(255,255,255,0.1)' }}>
                  <div style={{ 
                    width: `${Math.min((categories.waste / (footprint || 1)) * 100, 100)}%`, 
                    height: '100%', 
                    backgroundColor: 'rgba(120, 230, 255, 0.7)' 
                  }}></div>
                </div>
              </div>
            </div>
          </div>
          
          <div style={{
            margin: '1.5rem auto',
            padding: '12px',
            maxWidth: '80%',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
              {footprint && footprint < 7 
                ? 'Your carbon footprint is below average. Great work!' 
                : footprint && footprint < 12 
                  ? 'Your carbon footprint is around average for Americans.' 
                  : 'Your carbon footprint is higher than average.'}
            </p>
          </div>
        </div>
        
        <div style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.03)', 
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '32px', 
          marginBottom: '32px' 
        }}>
          <h3 style={{
            fontWeight: 200,
            fontSize: '1.2rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginTop: '0'
          }}>
            Priority Actions for {relevantActions?.title}
          </h3>
          
          <p style={{ opacity: 0.8, lineHeight: '1.6' }}>
            Based on your responses, focusing on {relevantActions?.title.toLowerCase()} would have the biggest impact.
          </p>
          
          <ul style={{ 
            paddingLeft: '20px',
            lineHeight: '1.6',
            opacity: 0.9
          }}>
            {relevantActions?.recommendations.map((rec, index) => (
              <li key={index} style={{ margin: '12px 0' }}>{rec}</li>
            ))}
          </ul>
          
          <h4 style={{ 
            marginTop: '24px',
            fontWeight: 200,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            fontSize: '0.9rem',
            opacity: 0.7
          }}>
            San Francisco Resources:
          </h4>
          
          <ul style={{ 
            paddingLeft: '20px',
            listStyleType: 'none' 
          }}>
            {relevantActions?.localResources.map((resource, index) => (
              <li key={index} style={{ margin: '12px 0' }}>
                <a 
                  href={resource.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    color: 'white',
                    textDecoration: 'none',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
                    paddingBottom: '2px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderBottom = '1px solid rgba(255, 255, 255, 0.8)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderBottom = '1px solid rgba(255, 255, 255, 0.3)';
                  }}
                >
                  {resource.name} →
                </a>
              </li>
            ))}
          </ul>
        </div>
        
        <div style={{ marginBottom: '48px' }}>
          <h3 style={{
            fontWeight: 200,
            fontSize: '1.2rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: '24px'
          }}>
            Other Areas to Improve
          </h3>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '24px' 
          }}>
            {otherActions.map(action => (
              <div key={action.id} style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.02)', 
                padding: '24px', 
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <h4 style={{
                  fontWeight: 200,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  fontSize: '1rem',
                  marginTop: '0'
                }}>
                  {action.title}
                </h4>
                
                <ul style={{ 
                  paddingLeft: '20px', 
                  fontSize: '0.9rem',
                  opacity: 0.8,
                  lineHeight: '1.5'
                }}>
                  {action.recommendations.slice(0, 2).map((rec, index) => (
                    <li key={index} style={{ margin: '8px 0' }}>{rec}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '24px', 
          marginTop: '48px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: '32px'
        }}>
          <button
            onClick={resetSurvey}
            style={{
              padding: '12px 24px',
              backgroundColor: 'transparent',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '0',
              cursor: 'pointer',
              fontFamily: 'CaskaydiaMono, monospace',
              fontWeight: 200,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              fontSize: '0.8rem',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            Retake Survey
          </button>
          
          <button 
            onClick={() => {
              // Share functionality - basic implementation
              if (navigator.share) {
                navigator.share({
                  title: 'My Carbon Footprint',
                  text: `My carbon footprint is ${footprint?.toFixed(1)} tons CO₂ per year! Check your impact on the climate with this survey.`,
                  url: window.location.href,
                })
                .catch(err => {
                  console.log('Error sharing:', err);
                });
              } else {
                alert('Share feature not supported by your browser. Try copying the URL manually.');
              }
            }}
            style={{
              padding: '12px 24px',
              backgroundColor: 'rgba(120, 255, 140, 0.2)',
              color: 'white',
              border: '1px solid rgba(120, 255, 140, 0.3)',
              borderRadius: '0',
              cursor: 'pointer',
              fontFamily: 'CaskaydiaMono, monospace',
              fontWeight: 200,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              fontSize: '0.8rem',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(120, 255, 140, 0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(120, 255, 140, 0.2)';
            }}
          >
            Share Results
          </button>
          
          <Link href="/SanFrancisco">
            <button
              style={{
                padding: '12px 24px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '0',
                cursor: 'pointer',
                fontFamily: 'CaskaydiaMono, monospace',
                fontWeight: 200,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                fontSize: '0.8rem',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              Return to Action Page
            </button>
          </Link>
        </div>
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>Carbon Footprint Survey - San Francisco</title>
        <meta name="description" content="Calculate your carbon footprint and find ways to reduce it in San Francisco" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem',
        color: '#ffffff',
        backgroundColor: '#000000',
        minHeight: '100vh',
        fontFamily: 'CaskaydiaMono, monospace',
        fontWeight: 200,
        letterSpacing: '0.05em',
        overflowY: 'auto'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          paddingBottom: '1rem'
        }}>
          <h1 style={{ 
            fontSize: '1.8rem', 
            margin: 0, 
            textTransform: 'uppercase',
            fontWeight: 200,
            letterSpacing: '0.15em'
          }}>
            Carbon Footprint Survey
          </h1>
          <div style={{ display: 'flex', gap: '10px' }}>
            {currentStep > 0 && footprint === null && (
              <button 
                onClick={() => {
                  // Use both approaches to ensure it works:
                  // 1. Set step count high (which triggers results when rendering)
                  // 2. Directly calculate footprint
                  setCurrentStep(500); 
                  calculateFootprint(answers);
                }}
                style={{
                  padding: '10px 20px',
                  backgroundColor: 'rgba(120, 255, 140, 0.2)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '0',
                  cursor: 'pointer',
                  fontFamily: 'CaskaydiaMono, monospace',
                  fontWeight: 200,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  fontSize: '0.8rem',
                  transition: 'all 0.3s ease'
                }}
              >
                See Results Now
              </button>
            )}
            <Link href="/SanFrancisco">
              <button style={{
                padding: '10px 20px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '0',
                cursor: 'pointer',
                fontFamily: 'CaskaydiaMono, monospace',
                fontWeight: 200,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                fontSize: '0.8rem',
                transition: 'all 0.3s ease'
              }}>
                Back to San Francisco
              </button>
            </Link>
          </div>
        </div>

        {currentStep === 0 && footprint === null && (
          <div style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '32px',
            marginBottom: '32px',
            textAlign: 'center'
          }}>
            <h2 style={{ 
              fontWeight: 200, 
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontSize: '1.4rem'
            }}>
              Comprehensive Carbon Footprint Assessment
            </h2>
            <p style={{ lineHeight: '1.6', maxWidth: '700px', margin: '1.5rem auto' }}>
              This 22-question survey will analyze your lifestyle across six key areas to estimate your carbon footprint and provide personalized recommendations for reducing your environmental impact in San Francisco.
            </p>
            
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '1rem',
              margin: '2rem auto',
              maxWidth: '700px'
            }}>
              <div style={{
                padding: '1rem',
                backgroundColor: 'rgba(120, 210, 255, 0.1)',
                border: '1px solid rgba(120, 210, 255, 0.2)',
                width: '200px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(120, 210, 255, 0.8)' }}>
                  Transportation
                </div>
              </div>
              
              <div style={{
                padding: '1rem',
                backgroundColor: 'rgba(120, 255, 140, 0.1)',
                border: '1px solid rgba(120, 255, 140, 0.2)',
                width: '200px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(120, 255, 140, 0.8)' }}>
                  Food & Diet
                </div>
              </div>
              
              <div style={{
                padding: '1rem',
                backgroundColor: 'rgba(255, 220, 120, 0.1)',
                border: '1px solid rgba(255, 220, 120, 0.2)',
                width: '200px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255, 220, 120, 0.8)' }}>
                  Housing & Energy
                </div>
              </div>
              
              <div style={{
                padding: '1rem',
                backgroundColor: 'rgba(230, 120, 255, 0.1)',
                border: '1px solid rgba(230, 120, 255, 0.2)',
                width: '200px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(230, 120, 255, 0.8)' }}>
                  Travel
                </div>
              </div>
              
              <div style={{
                padding: '1rem',
                backgroundColor: 'rgba(255, 150, 120, 0.1)',
                border: '1px solid rgba(255, 150, 120, 0.2)',
                width: '200px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255, 150, 120, 0.8)' }}>
                  Consumption
                </div>
              </div>
              
              <div style={{
                padding: '1rem',
                backgroundColor: 'rgba(120, 230, 255, 0.1)',
                border: '1px solid rgba(120, 230, 255, 0.2)',
                width: '200px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(120, 230, 255, 0.8)' }}>
                  Waste & Water
                </div>
              </div>
            </div>
            
            <p style={{ opacity: 0.7, fontSize: '0.9rem', maxWidth: '700px', margin: '1.5rem auto' }}>
              You can skip questions if they don't apply to you. Your results will include San Francisco-specific recommendations based on your highest impact areas.
            </p>
            
            <button 
              onClick={() => setCurrentStep(1)}
              style={{
                padding: '16px 32px',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '0',
                fontSize: '1rem',
                cursor: 'pointer',
                fontWeight: 200,
                margin: '16px 0',
                fontFamily: 'CaskaydiaMono, monospace',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Begin Assessment
            </button>
          </div>
        )}

        {renderSurvey()}
      </main>
    </>
  );
}