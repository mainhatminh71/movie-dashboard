import { Component, OnInit, inject } from "@angular/core";
import { MainLayoutComponent } from "./lib/layouts/main-layout/main-layout.component";
import { RAGService } from "./core/services/rag.service";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"],
    imports: [MainLayoutComponent],
    standalone: true
})
export class AppComponent implements OnInit {
  title = "Movie DashBoard";
  private ragService = inject(RAGService);

  ngOnInit() {
    // Kiểm tra và khởi tạo RAG nếu chưa có documents
    this.ragService.getDocumentCount().subscribe(count => {
      if (count === 0) {
        console.log('Initializing RAG system...');
        // Khởi tạo với 100 movies phổ biến để có đủ dữ liệu
        this.ragService.initializeRAG(100).subscribe({
          next: (addedCount) => {
            console.log(`✅ RAG initialized with ${addedCount} documents`);
          },
          error: (error) => {
            console.error('❌ Error initializing RAG:', error);
          }
        });
      } else {
        console.log(`✅ RAG already initialized with ${count} documents`);
      }
    });
  }
}







