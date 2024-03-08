import { AppDataSource } from "./config/db";

class Application {
    static async main(){
        await AppDataSource.initialize();
    }
}

export default Application;