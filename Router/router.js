import Route from "./Route.js";
import { allRoutes, websiteName } from "./AllRoutes.js";

// Route pour la page 404
const route404 = new Route("404", "Page introuvable", "/pages/404.html");

// Récupérer une route par son URL
const getRouteByUrl = (url) => {
  return allRoutes.find((route) => route.url === url) || route404;
};

// Charger le contenu de la page
const LoadContentPage = async () => {
  const path = window.location.pathname;

  try {
    // Récupération de la route actuelle
    const actualRoute = getRouteByUrl(path);

    // Chargement du fichier HTML
    const html = await fetch(actualRoute.pathHtml).then((res) => {
      if (!res.ok) throw new Error(`Erreur ${res.status}: ${res.statusText}`);
      return res.text();
    });
    document.getElementById("main-page").innerHTML = html;

    // Ajout des fichiers JS spécifiques à la page
    if (actualRoute.pathJS) {
      // Supprimer les anciens scripts
      document.querySelectorAll('script[data-dynamic="true"]').forEach((script) => script.remove());
      // Ajouter un nouveau script
      const scriptTag = document.createElement("script");
      scriptTag.setAttribute("type", "text/javascript");
      scriptTag.setAttribute("src", actualRoute.pathJS);
      scriptTag.setAttribute("data-dynamic", "true");
      document.body.appendChild(scriptTag);
    }

    // Mise à jour du titre de la page
    document.title = `${actualRoute.title} - ${websiteName}`;
  } catch (error) {
    console.error("Erreur lors du chargement de la page :", error.message);
    document.getElementById("main-page").innerHTML = "<p>Une erreur est survenue lors du chargement de la page.</p>";
  }
};

// Gestion des événements de navigation
const routeEvent = (event) => {
  event.preventDefault();
  const newUrl = event.target.href;
  window.history.pushState({}, "", newUrl);
  LoadContentPage();
};

// Gestion des retours dans l'historique
window.onpopstate = LoadContentPage;

// Assignation de la fonction pour les liens dynamiques
window.route = routeEvent;

// Chargement initial de la page
LoadContentPage();
