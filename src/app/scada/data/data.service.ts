import { Injectable } from '@angular/core';
import { Http, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscriber } from 'rxjs/Subscriber';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()

export class DataService {
    constructor( public http: Http) {}

    public getScada() {
        return this.http.get( './scada');
    }
}
