import { CommonModule } from '@angular/common';
import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { switchMap, catchError, of } from 'rxjs';
import {AIChatService} from '../../../core/services/ai-chat.service';
import { RAGService } from '../../../core/services/rag.service';

@Component({
  selector: 'app-ai-float-button',
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-float-button.component.html',
  styleUrl: './ai-float-button.component.css',
  standalone: true
})
export class AiFloatButtonComponent {
  private ragService = inject(RAGService);
  private aiChatService = inject(AIChatService);

  isLoading = signal(false);
  isChatOpen = signal(false);
  messages = signal<Array<{role: 'user' | 'assistant', 
    content: string, timestamp: Date}>>([]);
  userInput = signal<string>('');

  toggleChat() {
    this.isChatOpen.update(open => !open);
    if (this.isChatOpen() && this.messages().length === 0) {
      this.addWelcomeMessage();
    }
  }
  addWelcomeMessage() {
    this.messages.set([{
      role: 'assistant',
      content: 'Hello! I am your AI assistant. How can I help you today?',
      timestamp: new Date(),
    }])
  }
  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
  sendMessage() {
    const query = this.userInput().trim();
    if (!query || this.isLoading()) return;

    // Thêm user message vào chat
    this.messages.update(msgs => [...msgs, {
      role: 'user',
      content: query,
      timestamp: new Date()
    }]);

    this.userInput.set('');
    this.isLoading.set(true);

    // Lấy relevant documents từ RAG, sau đó gọi AI chat
    this.ragService.getRelevantDocuments(query, 5).pipe(
      catchError((error) => {
        console.error('RAG search error:', error);
        return of([]);
      }),
      switchMap((contextDocs) => {
        return this.aiChatService.chat(query, contextDocs);
      }),
      // Xử lý lỗi từ AI chat
      catchError((error) => {
        console.error('Chat error:', error);
        return of('Xin lỗi, đã có lỗi xảy ra khi xử lý câu trả lời. Vui lòng thử lại sau.');
      })
    ).subscribe({
      next: (response) => {
        this.messages.update(msgs => [...msgs, {
          role: 'assistant',
          content: response,
          timestamp: new Date()
        }]);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Unexpected error:', error);
        this.messages.update(msgs => [...msgs, {
          role: 'assistant',
          content: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.',
          timestamp: new Date()
        }]);
        this.isLoading.set(false);
      }
    });
  }
  
}
