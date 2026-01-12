import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
@Component({
    selector: "app-recent",
    templateUrl: "./recent.component.html",
    styleUrls: ["./recent.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class RecentComponent {}
