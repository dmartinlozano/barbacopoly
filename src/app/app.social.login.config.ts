import { AuthServiceConfig, GoogleLoginProvider, FacebookLoginProvider } from "angular-6-social-login";
import * as credentials from "../../.credentials.json";

export function getAuthServiceConfigs() {
    let config = new AuthServiceConfig([
        {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider("Your-Facebook-app-id")
        },
        {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(credentials.default.google.clientId)
        }
    ]);
    return config;
}