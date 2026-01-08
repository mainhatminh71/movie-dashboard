import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
@Component({
    selector: "app-log-out",
    templateUrl: "./log-out.component.html",
    styleUrls: ["./log-out.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class LogOutComponent {}
