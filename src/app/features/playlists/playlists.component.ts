import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
@Component({
    selector: "app-playlists",
    templateUrl: "./playlists.component.html",
    styleUrls: ["./playlists.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class PlaylistsComponent {}
