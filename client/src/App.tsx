import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import MisExhibidores from "@/pages/MisExhibidores";
import TrazabilidadDetalle from "@/pages/TrazabilidadDetalle";
import ControlDocumental from "@/pages/ControlDocumental";
import Reportes from "@/pages/Reportes";

// Legacy pages (kept for backwards compatibility)
import Documents from "@/pages/documents";
import Analysis from "@/pages/analysis";
import DataEntry from "@/pages/DataEntry";
import ResiduosExcel from "@/pages/ResiduosExcel";
import RegistroDiario from "@/pages/RegistroDiario";
import HistorialMensual from "@/pages/HistorialMensual";
import Energia from "@/pages/Energia";
import Agua from "@/pages/Agua";
import EconomiaCircular from "@/pages/EconomiaCircular";
import DataExport from "@/pages/DataExport";
import { Diagnostico } from "@/pages/Diagnostico";
import Home from "@/pages/Home";
import LotsPage from "@/pages/LotsPage";
import LotDetailPage from "@/pages/LotDetailPage";
import ReportPage from "@/pages/ReportPage";

function Router() {
  return (
    <Switch>
      {/* Main Portal Routes */}
      <Route path="/" component={Dashboard} />
      <Route path="/exhibidores" component={MisExhibidores} />
      <Route path="/trazabilidad/:exhibitorId" component={TrazabilidadDetalle} />
      <Route path="/trazabilidad" component={MisExhibidores} />
      <Route path="/documentos" component={ControlDocumental} />
      <Route path="/reportes" component={Reportes} />
      
      {/* Legacy Routes (kept for backwards compatibility) */}
      <Route path="/home" component={Home} />
      <Route path="/lots/:flowType" component={LotsPage} />
      <Route path="/lot/:lotId" component={LotDetailPage} />
      <Route path="/report/:lotId" component={ReportPage} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/registro-diario" component={RegistroDiario} />
      <Route path="/historial-mensual" component={HistorialMensual} />
      <Route path="/trazabilidad-residuos" component={ResiduosExcel} />
      <Route path="/energia" component={Energia} />
      <Route path="/agua" component={Agua} />
      <Route path="/economia-circular" component={EconomiaCircular} />
      <Route path="/diagnostico" component={Diagnostico} />
      <Route path="/documents" component={Documents} />
      <Route path="/analysis" component={Analysis} />
      <Route path="/data-entry" component={DataEntry} />
      <Route path="/export" component={DataExport} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
