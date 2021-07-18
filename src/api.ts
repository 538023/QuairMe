import Ajv from 'ajv';
import { Request, Response, Router } from 'express';
import fetch from 'node-fetch';
import Controller from './controller';

/**
 * use openweathermap
 */
class Api extends Controller {
  private static readonly apiKey = 'c769c9c8e3b504df816db5f30fe31c1c';
  private static readonly apiUrl = 'api.openweathermap.org';
  private static readonly ajv = new Ajv();
  private static readonly responseSchema = {
    type: "object",
    properties: {
      list: {type: "array", items: {
        type: "object",
        properties: {
          dt: {type:"number"},
          main: {
            type: "object",
            properties: {
              aqi: {type:"number"}
            },
            required: ["aqi"],
            additionalProperties: false
          }
        },
        required: ["dt", "main"],
        additionalProperties: true
      }, minItems: 1},
    },
    required: ["list"],
    additionalProperties: true
  };

  /**
   *
   */
  router(): Router {
    const router: Router = Router();
    router.get('/lat/:lat/lon/:lon', Api.get);
    router.get('/lon/:lon/lat/:lat', Api.get);
    return router;
  }

  /**
   * @param req
   * @param res
   */
  static async get(req: Request, res: Response) {
    const requrestUrl = `http://${Api.apiUrl}/data/2.5/air_pollution?lat=${req.params.lat}&lon=${req.params.lon}&appid=${Api.apiKey}`;
    const data = await fetch(requrestUrl).then((res) => res.json());
    if(Api.ajv.validate(Api.responseSchema, data)) {
      let aqiState = 'unknown';
      switch(data.list[0].main.aqi) {
        case 1:
          aqiState = 'very_low';
          break;
        case 2:
          aqiState = 'low';
          break;
        case 3:
          aqiState = 'medium';
          break;
        case 4:
          aqiState = 'high';
          break;
        case 5:
          aqiState = 'very_high';
          break;
      }
      res.send({
        aqiState: aqiState,
        time: data.list[0].dt
      });
    }
  }
}

export default Api;