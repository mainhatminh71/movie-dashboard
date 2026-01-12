import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
@Component({
    selector: "app-top-rated",
    templateUrl: "./top-rated.component.html",
    styleUrls: ["./top-rated.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class TopRatedComponent {}
