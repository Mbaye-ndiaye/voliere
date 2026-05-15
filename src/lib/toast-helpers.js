import { toast } from "sonner";

/**
 * Affiche un toast de succès
 * @param {string} message - Le message à afficher
 */
export const showSuccess = (message) => {
  toast.success(message);
};

/**
 * Affiche un toast d'erreur
 * @param {string} message - Le message à afficher
 * @param {Error} [error] - L'erreur optionnelle pour le log
 */
export const showError = (message, error) => {
  if (error) {
    console.error(message, error);
  }
  toast.error(message);
};

/**
 * Affiche un toast d'information
 * @param {string} message - Le message à afficher
 */
export const showInfo = (message) => {
  toast.info(message);
};

/**
 * Affiche un toast d'avertissement
 * @param {string} message - Le message à afficher
 */
export const showWarning = (message) => {
  toast.warning(message);
};

/**
 * Affiche un toast de chargement
 * @param {string} message - Le message à afficher
 * @returns {string|number} - L'ID du toast pour pouvoir le fermer plus tard
 */
export const showLoading = (message) => {
  return toast.loading(message);
};

/**
 * Ferme un toast spécifique
 * @param {string|number} toastId - L'ID du toast à fermer
 */
export const dismissToast = (toastId) => {
  toast.dismiss(toastId);
};
