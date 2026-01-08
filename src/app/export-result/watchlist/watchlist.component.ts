import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
@Component({
    selector: "app-watchlist",
    templateUrl: "./watchlist.component.html",
    styleUrls: ["./watchlist.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class WatchlistComponent {}
