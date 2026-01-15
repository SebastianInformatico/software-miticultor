from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
import requests
from datetime import datetime, timedelta
from sklearn.linear_model import LinearRegression

app = FastAPI()

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "online", "service": "Miticultor AI Analytics"}

def get_spring_data(linea_id: int):
    try:
        response = requests.get(f"http://localhost:8080/api/lineas/{linea_id}/historial")
        if response.status_code == 200:
            return response.json()
        return []
    except:
        return []

@app.get("/api/predict/harvest")
def predict_harvest(linea_id: int):
    """
    Predicts harvest based on real historical data if available,
    otherwise falls back to a theoretical model.
    """
    
    # 1. Fetch Real Data from Spring Boot
    history = get_spring_data(linea_id)
    
    predictions = []
    
    if len(history) >= 2:
        # --- ML MODEL (Linear Regression on Real Data) ---
        df = pd.DataFrame(history)
        df['fechaMedicion'] = pd.to_datetime(df['fechaMedicion'])
        
        # Calculate days since first measurement
        start_date = df['fechaMedicion'].min()
        df['days_since_start'] = (df['fechaMedicion'] - start_date).dt.days
        
        X = df[['days_since_start']]
        y = df['tallaPromedioMm']
        
        model = LinearRegression()
        model.fit(X, y)
        
        # Predict next 12 months
        last_date = df['fechaMedicion'].max()
        current_days_offset = (last_date - start_date).days
        
        for i in range(1, 13):
            future_days = current_days_offset + (i * 30)
            pred_size = model.predict([[future_days]])[0]
            
            # Confidence interval (simple heuristic for demo)
            margin = pred_size * 0.05
            future_date = last_date + timedelta(days=i*30)
            
            predictions.append({
                "mes": future_date.strftime("%b %Y"),
                "talla_estimada_mm": round(pred_size, 2),
                "talla_min_mm": round(pred_size - margin, 2),
                "talla_max_mm": round(pred_size + margin, 2),
                "probabilidad_exito": 0.95
            })
            
        recomendacion = predictions[8]["mes"] # Mock logic for best harvest time
        rentabilidad = f"$ {int(predictions[-1]['talla_estimada_mm'] * 500)} CLP (Est)"

    else:
        # --- FALLBACK (Theoretical Model) ---
        np.random.seed(linea_id)
        base_growth = 100 + (linea_id * 5)
        current_date = datetime.now()
        
        for i in range(12):
            future_date = current_date + timedelta(days=30*i)
            # Logarithmic growth simulation
            growth_factor = np.log(i + 1) * 20 + np.random.normal(0, 2)
            projected_size_mm = base_growth + growth_factor
            
            margin = projected_size_mm * 0.05
            
            predictions.append({
                "mes": future_date.strftime("%b %Y"),
                "talla_estimada_mm": round(projected_size_mm, 2),
                "talla_min_mm": round(projected_size_mm - margin, 2),
                "talla_max_mm": round(projected_size_mm + margin, 2),
                "probabilidad_exito": round(np.random.uniform(0.85, 0.99), 2)
            })
            
        recomendacion = predictions[8]["mes"]
        rentabilidad = f"$ {np.random.randint(4, 9)}M CLP"

    return {
        "linea_id": linea_id,
        "source": "Real Data (ML)" if len(history) >= 2 else "Theoretical Model (Simulation)",
        "data_points": len(history),
        "predicciones": predictions,
        "recomendacion_cosecha": recomendacion,
        "rentabilidad_estimada": rentabilidad
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
