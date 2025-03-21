import { state, API_URL } from "../../state/state.js";
import { escapeHTML, validateInputs, isValidUsername, isValidEmail, isValidPassword } from "../../utils/utils.js";
import { renderPage, navigate } from "../../routes/index.js";
import Snackbar from '../../components/ui/Snackbar.mjs';






export { signup };