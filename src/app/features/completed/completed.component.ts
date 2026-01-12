import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
@Component({
    selector: "app-completed",
    templateUrl: "./completed.component.html",
    styleUrls: ["./completed.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class CompletedComponent {}
