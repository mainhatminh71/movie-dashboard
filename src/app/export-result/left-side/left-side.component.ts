import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { IconComponent } from "../icon/icon.component";
import { SettingsComponent } from "../settings/settings.component";
import { WatchlistIconComponent } from "../watchlist/watchlist-icon.component";
import { TopRatedComponent } from "../top-rated/top-rated.component";
import { DiscoverIconComponent } from "../discover/discover-icon.component";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { StorageService } from "src/app/core/services/moviestorage.service";

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
        WatchlistIconComponent,
        TopRatedComponent,
        DiscoverIconComponent
    ],
    standalone: true
})
export class LeftSideComponent {
    private storageService = inject(StorageService);
    watchlistCount = this.storageService.count;

    closeMobileMenu(): void {
        const sidebar = document.querySelector('.left-side_54-43');
        const backdrop = document.querySelector('.bg_2-9');
        
        if (sidebar && backdrop) {
            sidebar.classList.remove('mobile-open');
            backdrop.classList.remove('mobile-open');
        }
    }
}
