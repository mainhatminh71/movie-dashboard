import { Component, OnInit, inject, signal, computed } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MovieStore } from "src/app/core/stores/movie.store";
import { StorageService } from "src/app/core/services/moviestorage.service";
import { WatchListItem } from "src/app/core/models/watchlistitem.model";
import { environment } from "src/environments/environment";
import { ConfirmDialogComponent } from "../../lib/components/confirm-dialog/confirm-dialog.component";

@Component({
    selector: "app-watchlist-page",
    templateUrl: "./watchlist.component.html",
    styleUrls: ["./watchlist.component.scss"],
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatDialogModule,
        MatSnackBarModule
    ]
})
export class WatchlistComponent implements OnInit {
    private movieStore = inject(MovieStore);
    private storageService = inject(StorageService);
    private dialog = inject(MatDialog);
    private snackBar = inject(MatSnackBar);
    router = inject(Router);

    watchList = this.storageService.watchList;
    searchQuery = signal<string>('');
    currentPage = signal<number>(1);
    itemsPerPage = 20;
    
    filteredWatchList = computed(() => {
        const items = this.watchList();
        const query = this.searchQuery().toLowerCase().trim();
        if (!query) return items;
        return items.filter(item => 
            item.title.toLowerCase().includes(query)
        );
    });
    
    totalPages = computed(() => {
        const total = this.filteredWatchList().length;
        return Math.ceil(total / this.itemsPerPage);
    });
    
    paginatedWatchList = computed(() => {
        const items = this.filteredWatchList();
        const page = this.currentPage();
        const start = (page - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        return items.slice(start, end);
    });

    ngOnInit(): void {    }

    getImageUrl(path: string | null, size: string = 'w300'): string {
        if (!path) {
            return 'https://via.placeholder.com/300x450?text=No+Image';
        }
        return `${environment.tmdbImageBaseUrl}${size}${path}`;
    }

    getYear(dateString: string | null): string {
        if (!dateString) return 'N/A';
        return new Date(dateString).getFullYear().toString();
    }

    onSearchInput(event: Event): void {
        const input = event.target as HTMLInputElement;
        this.searchQuery.set(input.value);
        this.currentPage.set(1); // Reset to first page when searching
    }

    removeFromWatchlist(item: WatchListItem): void {
        this.storageService.removeItemById(item.id);
        this.snackBar.open(`${item.title} removed from watchlist`, 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
        });
    }

    navigateToDetails(item: WatchListItem): void {
        if (item.type === 'tvshow') {
            this.router.navigate(['/tv', item.id], {
                state: { referrer: 'watchlist' }
            });
        } else {
            this.router.navigate(['/movie', item.id], {
                state: { referrer: 'watchlist' }
            });
        }
    }

    onImageError(event: Event): void {
        const img = event.target as HTMLImageElement;
        if (img) {
            img.src = 'https://via.placeholder.com/300x450?text=No+Image';
        }
    }

    clearSearch(): void {
        this.searchQuery.set('');
        this.currentPage.set(1);
    }
    
    goToPage(page: number): void {
        const total = this.totalPages();
        if (page >= 1 && page <= total) {
            this.currentPage.set(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
    
    getPagesArray(): number[] {
        const pages: number[] = [];
        const maxVisible = 5;
        const current = this.currentPage();
        const total = this.totalPages();
        
        let start = Math.max(1, current - Math.floor(maxVisible / 2));
        let end = Math.min(total, start + maxVisible - 1);
        
        if (end - start < maxVisible - 1) {
            start = Math.max(1, end - maxVisible + 1);
        }
        
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        
        return pages;
    }

    getRelativeDate(dateString: string): string {
        if (!dateString) return '';
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'today';
        if (diffDays === 1) return 'yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) {
            const weeks = Math.floor(diffDays / 7);
            return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
        }
        if (diffDays < 365) {
            const months = Math.floor(diffDays / 30);
            return `${months} ${months === 1 ? 'month' : 'months'} ago`;
        }
        const years = Math.floor(diffDays / 365);
        return `${years} ${years === 1 ? 'year' : 'years'} ago`;
    }

    navigateToDiscover(): void {
        this.router.navigate(['/discover']);
    }

    showClearConfirmDialog(): void {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: {
                title: 'Clear Watchlist',
                message: 'Are you sure you want to clear your entire watchlist? This action cannot be undone.',
                subMessage: `${this.watchList().length} ${this.watchList().length === 1 ? 'item' : 'items'} will be removed.`,
                confirmText: 'Clear Watchlist',
                cancelText: 'Cancel'
            },
            width: '500px',
            maxWidth: '90vw',
            disableClose: false,
            panelClass: 'confirm-dialog-container'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.confirmClearWatchlist();
            }
        });
    }

    confirmClearWatchlist(): void {
        this.storageService.clearWatchList([]);
        this.currentPage.set(1);
        this.snackBar.open('Watchlist cleared', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
        });
    }
}
