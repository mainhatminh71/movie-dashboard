import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
@Component({
    selector: "app-discover",
    templateUrl: "./discover.component.html",
    styleUrls: ["./discover.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class DiscoverComponent {}
