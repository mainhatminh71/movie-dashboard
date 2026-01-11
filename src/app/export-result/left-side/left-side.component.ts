import { ChangeDetectionStrategy, Component } from "@angular/core";
import { IconComponent } from "../icon/icon.component";
import { SettingsComponent } from "../settings/settings.component";
import { WatchlistComponent } from "../watchlist/watchlist.component";
import { TopRatedComponent } from "../top-rated/top-rated.component";
import { DiscoverIconComponent } from "../discover/discover-icon.component";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

@Component({
    selector: "app-left-side",
    templateUrl: "./left-side.component.html",
    styleUrls: ["./left-side.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        RouterModule,
        IconComponent,
        SettingsComponent,
        WatchlistComponent,
        TopRatedComponent,
        DiscoverIconComponent
    ],
    standalone: true
})
export class LeftSideComponent {}
