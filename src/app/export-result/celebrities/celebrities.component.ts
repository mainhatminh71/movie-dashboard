import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
@Component({
    selector: "app-celebrities",
    templateUrl: "./celebrities.component.html",
    styleUrls: ["./celebrities.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class CelebritiesComponent {}
