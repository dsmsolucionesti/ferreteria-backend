import { JsonController, Get } from "routing-controllers";

@JsonController("/activesys")
export class ActiveSysController {
  @Get()
  check() {
    return {
      status: "ok",
      message: "API Ferreteria operativa!!",
      timestamp: new Date().toISOString(),
    };
  }
  
}
