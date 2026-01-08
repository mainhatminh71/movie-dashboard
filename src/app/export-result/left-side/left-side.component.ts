import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { IconComponent } from "../icon/icon.component";
import { LogOutComponent } from "../log-out/log-out.component";
import { SettingsComponent } from "../settings/settings.component";
import { CompletedComponent } from "../completed/completed.component";
import { WatchlistComponent } from "../watchlist/watchlist.component";
import { PlaylistsComponent } from "../playlists/playlists.component";
import { DownloadedComponent } from "../downloaded/downloaded.component";
import { TopRatedComponent } from "../top-rated/top-rated.component";
import { RecentComponent } from "../recent/recent.component";
import { CelebritiesComponent } from "../celebrities/celebrities.component";
import { AwardComponent } from "../award/award.component";
import { DiscoverComponent } from "../discover/discover.component";
@Component({
    selector: "app-left-side",
    templateUrl: "./left-side.component.html",
    styleUrls: ["./left-side.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [IconComponent, LogOutComponent, SettingsComponent, CompletedComponent, WatchlistComponent, PlaylistsComponent, DownloadedComponent,
        TopRatedComponent, RecentComponent, CelebritiesComponent, AwardComponent, DiscoverComponent
    ],
    standalone: true
})
export class LeftSideComponent {}
