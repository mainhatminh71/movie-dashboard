import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
@Component({
    selector: "app-award",
    templateUrl: "./award.component.html",
    styleUrls: ["./award.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class AwardComponent {}
