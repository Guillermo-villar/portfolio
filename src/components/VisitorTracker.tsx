import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

interface PageVisit {
  path: string;
  timeSpent: number;
  timestamp: string;
}

const VisitorTracker = () => {
  const location = useLocation();
  
  // Refs para mantener el estado mutable sin provocar re-renders
  const startTime = useRef<number>(Date.now());
  const history = useRef<PageVisit[]>([]);
  const visitorDataRef = useRef<any>(null);
  const isInitialized = useRef(false);
  const currentPathRef = useRef(location.pathname);

  // ---------------------------------------------------------------------------
  // CONFIGURACIÓN: Usa una variable de entorno para elegir el webhook.
  // - Dev:   .env.development
  // - Prod:  .env.production (ej: GitHub Pages)
  // CRA solo expone env vars que empiezan por REACT_APP_
  // ---------------------------------------------------------------------------
  const N8N_WEBHOOK_URL = (process.env.REACT_APP_N8N_WEBHOOK_URL || '').trim();

  // 1. Obtener datos del visitante al inicio
  useEffect(() => {
    const initVisitor = async () => {
      if (isInitialized.current) return;
      isInitialized.current = true;

      try {
        // Intentar recuperar de sessionStorage para no saturar la API
        const stored = sessionStorage.getItem('visitorData');
        if (stored) {
          visitorDataRef.current = JSON.parse(stored);
        } else {
          // Solo fetch si no estamos en localhost (opcional)
          if (window.location.hostname !== 'localhost') {
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            visitorDataRef.current = {
              ip: data.ip,
              city: data.city,
              country: data.country_name,
              org: data.org,
              userAgent: navigator.userAgent,
              sessionId: Math.random().toString(36).substring(7)
            };
            sessionStorage.setItem('visitorData', JSON.stringify(visitorDataRef.current));
          } else {
             visitorDataRef.current = { ip: 'localhost', sessionId: 'dev' };
          }
        }
      } catch (error) {
        console.error('Error tracking visitor:', error);
        visitorDataRef.current = { error: true };
      }
    };

    initVisitor();
  }, []);

  // 2. Detectar navegación y guardar historial
  useEffect(() => {
    // Si la ruta ha cambiado
    if (currentPathRef.current !== location.pathname) {
      const now = Date.now();
      const timeSpent = Math.round((now - startTime.current) / 1000);

      // Guardar la página ANTERIOR en el historial
      history.current.push({
        path: currentPathRef.current,
        timeSpent: timeSpent,
        timestamp: new Date().toISOString()
      });

      console.log(`⏱️ Página ${currentPathRef.current}: ${timeSpent}s`);

      // Actualizar referencias para la nueva página
      currentPathRef.current = location.pathname;
      startTime.current = now;
    }
  }, [location]);

  // 3. Enviar datos al cerrar la pestaña o cambiar de app (Beacon)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // Calcular tiempo de la página actual (la última antes de cerrar)
        const now = Date.now();
        const timeSpent = Math.round((now - startTime.current) / 1000);
        
        // Crear historial final incluyendo la página actual
        const finalHistory = [
          ...history.current,
          { 
            path: currentPathRef.current, 
            timeSpent: timeSpent, 
            timestamp: new Date().toISOString() 
          }
        ];

        const totalTime = finalHistory.reduce((acc, curr) => acc + curr.timeSpent, 0);

        const payload = {
          visitor: visitorDataRef.current || {},
          history: finalHistory,
          summary: {
            totalTimeSeconds: totalTime,
            totalPages: finalHistory.length,
            exitPage: currentPathRef.current,
            timestamp: new Date().toISOString()
          }
        };

        // Usar keepalive: true es CRÍTICO para que el request sobreviva al cierre de la página
  if (N8N_WEBHOOK_URL) {
            fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            keepalive: true
            }).catch(err => console.error('Error sending to n8n:', err));
        } else {
            console.log("📡 [Simulación n8n] Payload listo:", payload);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return null;
};

export default VisitorTracker;
