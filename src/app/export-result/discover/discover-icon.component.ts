import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
    selector: "app-discover",
    templateUrl: "./discover-icon.component.html",
    styleUrls: ["./discover-icon.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class DiscoverIconComponent {}

