import { Component, OnInit, inject, signal, computed } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { MovieStore } from "src/app/core/stores/movie.store";
import { StorageService } from "src/app/core/services/moviestorage.service";
import { WatchListItem } from "src/app/core/models/watchlistitem.model";
import { environment } from "src/environments/environment";

@Component({
    selector: "app-watchlist-page",
    templateUrl: "./watchlist.component.html",
    styleUrls: ["./watchlist.component.scss"],
    standalone: true,
    imports: [CommonModule]
})
export class WatchlistComponent implements OnInit {
    private movieStore = inject(MovieStore);
    private storageService = inject(StorageService);
    router = inject(Router);

    watchList = this.storageService.watchList;
    searchQuery = signal<string>('');
    currentPage = signal<number>(1);
    itemsPerPage = 20;
    showClearConfirm = signal<boolean>(false);
    
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
        this.showClearConfirm.set(true);
    }

    cancelClear(): void {
        this.showClearConfirm.set(false);
    }

    confirmClearWatchlist(): void {
        this.storageService.clearWatchList([]);
        this.showClearConfirm.set(false);
        this.currentPage.set(1);
    }
}
