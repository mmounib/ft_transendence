import { createContext, useContext } from "react";
import { AppInterface } from "./Service/AppDataService";

const AppDataContext = createContext<AppInterface | undefined>(undefined)

function useAppServiceContext() {

    const appData = useContext(AppDataContext)

    if (appData === undefined) {
        throw new Error("AppData is not defined");
    }

    return (appData)
}

export {
    AppDataContext,
    useAppServiceContext
}
