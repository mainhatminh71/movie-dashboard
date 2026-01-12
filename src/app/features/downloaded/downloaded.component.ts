import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
@Component({
    selector: "app-downloaded",
    templateUrl: "./downloaded.component.html",
    styleUrls: ["./downloaded.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class DownloadedComponent {}
