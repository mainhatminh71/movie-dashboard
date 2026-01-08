import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
@Injectable({
    providedIn: 'root'
})
export class TVShowService {
    private baseUrl = environment.tmdbBaseUrl;
    constructor(private http : HttpClient) {}

    getPopularTVShow(page : number = 1) : Observable<any> {
        return this.http.get(`${this.baseUrl}/tv/popular`, 
            {
                params: {page}
            }
        );
    } 
}