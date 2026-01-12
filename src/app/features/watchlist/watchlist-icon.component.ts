import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
    selector: "app-watchlist-icon",
    templateUrl: "./watchlist-icon.component.html",
    styleUrls: ["./watchlist-icon.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class WatchlistIconComponent {}

