import sys
import json
import random
import time
# Try importing opencv/ultralytics, fall back to mock if missing
try:
    import cv2
    import numpy as np
    # from ultralytics import YOLO # Commented out to avoid dependency hell in this restricted env if not installed
except ImportError:
    pass

def analyze_video(video_path, video_id):
    # Mock analysis for demonstration if heavy ML libs are not fully set up
    # In a real scenario, this would load the YOLO model and process frames.
    
    # Simulate processing time
    time.sleep(2)
    
    # Generate realistic traffic data
    car_count = random.randint(50, 200)
    bus_count = random.randint(5, 20)
    truck_count = random.randint(10, 30)
    motorcycle_count = random.randint(20, 50)
    
    # Generate mock GPS track (simulating a route on a highway)
    # Starting around a random location
    start_lat = 40.7128 + random.uniform(-0.01, 0.01)
    start_lng = -74.0060 + random.uniform(-0.01, 0.01)
    
    gps_points = []
    for i in range(20):
        density = random.choice(["low", "medium", "high"])
        gps_points.append({
            "latitude": start_lat + (i * 0.001),
            "longitude": start_lng + (i * 0.001),
            "speed": random.uniform(30, 80), # km/h
            "road_name": random.choice(["Main St", "Broadway", "Oak Ave", "Highway 101"]),
            "traffic_density": density,
            "alternative_routes": [
                {
                    "name": "Side Road A",
                    "density": "low",
                    "points": [[start_lat + 0.002, start_lng], [start_lat + 0.002, start_lng + 0.01]]
                },
                {
                    "name": "Alternate Highway",
                    "density": "medium",
                    "points": [[start_lat - 0.002, start_lng], [start_lat - 0.002, start_lng + 0.01]]
                }
            ]
        })

    result = {
        "counts": {
            "car": car_count,
            "bus": bus_count,
            "truck": truck_count,
            "motorcycle": motorcycle_count
        },
        "processedUrl": None, # In real app, this would be path to annotated video
        "thumbnailUrl": None,
        "gpsPoints": gps_points
    }
    
    # Output JSON to stdout for Node.js to capture
    print(json.dumps(result))

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(json.dumps({"error": "Missing arguments"}))
        sys.exit(1)
        
    video_path = sys.argv[1]
    video_id = sys.argv[2]
    
    analyze_video(video_path, video_id)
