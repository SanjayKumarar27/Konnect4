import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ChatService, Conversation } from '../services/chat-service';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.html',
  styleUrls: ['./chat-list.css'],
  standalone: false
})
export class ChatList implements OnInit, OnDestroy {
  conversations: Conversation[] = [];
  currentUserId: number = 0;
  isLoading: boolean = true;
  isConnected: boolean = false;
  unreadCount: number = 0;
  searchQuery: string = '';
  searchResults: any[] = [];
  showSearch: boolean = false;

  private subscriptions: Subscription[] = [];

  constructor(
    private chatService: ChatService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.loadCurrentUser();
    
    // Start SignalR connection
    await this.chatService.startConnection(this.currentUserId);
    
    // Subscribe to connection state
    this.subscriptions.push(
      this.chatService.connectionState$.subscribe(isConnected => {
        this.isConnected = isConnected;
        if (isConnected) {
          this.loadConversations();
          this.loadUnreadCount();
        }
      })
    );

    // Subscribe to new messages
    this.subscriptions.push(
      this.chatService.messageReceived$.subscribe(message => {
        this.handleNewMessage(message);
      })
    );

    // Subscribe to online status
    this.subscriptions.push(
      this.chatService.userOnline$.subscribe(status => {
        this.updateUserOnlineStatus(status.userId, status.isOnline);
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadCurrentUser() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.currentUserId = user.userId;
    }
  }

  loadConversations() {
    this.isLoading = true;
    this.chatService.getConversations(this.currentUserId).subscribe({
      next: (conversations) => {
        this.conversations = conversations;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading conversations:', error);
        this.isLoading = false;
      }
    });
  }

  loadUnreadCount() {
    this.chatService.getUnreadCount(this.currentUserId).subscribe({
      next: (count) => {
        this.unreadCount = count;
      },
      error: (error) => console.error('Error loading unread count:', error)
    });
  }

  handleNewMessage(message: any) {
    const conversation = this.conversations.find(c => c.conversationId === message.conversationId);
    if (conversation) {
      conversation.lastMessage = message;
      conversation.lastMessageAt = message.sentAt;
      
      if (message.senderId !== this.currentUserId) {
        conversation.unreadCount++;
        this.unreadCount++;
      }
      
      this.conversations = [conversation, ...this.conversations.filter(c => c.conversationId !== message.conversationId)];
    } else {
      this.loadConversations();
    }
  }

  updateUserOnlineStatus(userId: number, isOnline: boolean) {
    this.conversations.forEach(conversation => {
      if (conversation.otherUser.userId === userId) {
        conversation.otherUser.isOnline = isOnline;
      }
    });
  }

  selectConversation(conversation: Conversation) {
    this.router.navigate(['/chat', conversation.conversationId]);
  }

  formatMessageTime(date: Date): string {
    const messageDate = new Date(date);
    const now = new Date();
    const diff = now.getTime() - messageDate.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    
    return messageDate.toLocaleDateString();
  }

  onSearchInput() {
    if (!this.searchQuery.trim()) {
      this.searchResults = [];
      return;
    }

    this.chatService.searchUsers(this.searchQuery, this.currentUserId).subscribe({
      next: (users) => {
        this.searchResults = users;
      },
      error: (error) => console.error('Error searching users:', error)
    });
  }

  startNewChat(user: any) {
    this.chatService.createOrGetConversation(this.currentUserId, user.userId).subscribe({
      next: (conversation) => {
        this.searchQuery = '';
        this.searchResults = [];
        this.showSearch = false;
        this.router.navigate(['/chat', conversation.conversationId]);
      },
      error: (error) => console.error('Error creating conversation:', error)
    });
  }

  deleteConversation(event: Event, conversation: Conversation) {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this conversation?')) {
      this.chatService.deleteConversation(conversation.conversationId, this.currentUserId).subscribe({
        next: () => {
          this.conversations = this.conversations.filter(c => c.conversationId !== conversation.conversationId);
        },
        error: (error) => console.error('Error deleting conversation:', error)
      });
    }
  }
}