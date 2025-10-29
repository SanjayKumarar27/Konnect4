import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription, BehaviorSubject } from 'rxjs';
import { ChatService, Message } from '../services/chat-service';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.html',
  styleUrls: ['./chat-room.css'],
  standalone: false
})
export class ChatRoom implements OnInit, OnDestroy {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  currentUserId: number = 0;
  conversationId: number = 0;
  conversation: any = null;
  messages: Message[] = [];
  newMessage: string = '';
  isLoading: boolean = false;
  isConnected: boolean = false;
  typingUsers: Map<number, string> = new Map();
  
  emojiInput$ = new BehaviorSubject<string>('');
  
  private subscriptions: Subscription[] = [];
  private typingTimeout: any;
   private emojiSub!: Subscription;
  constructor(
    private chatService: ChatService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  


  async ngOnInit() {
    this.loadCurrentUser();
    
    // Get conversation ID from route
    this.route.params.subscribe(params => {
      this.conversationId = +params['id'];
      if (this.conversationId) {
        this.loadConversation();
      }
    
    });

    // Subscribe to emoji input
    this.subscriptions.push(
      this.emojiInput$.subscribe((emoji) => {
        if (emoji) this.newMessage += emoji;
      })
    );

    // Subscribe to connection state
    this.subscriptions.push(
      this.chatService.connectionState$.subscribe(isConnected => {
        this.isConnected = isConnected;
      })
    );

    // Subscribe to new messages
    this.subscriptions.push(
      this.chatService.messageReceived$.subscribe(message => {
        this.handleNewMessage(message);
      })
    );

    // Subscribe to typing indicators
    this.subscriptions.push(
      this.chatService.typing$.subscribe(typing => {
        this.handleTypingIndicator(typing);
      })
    );

    // Subscribe to user online status
    this.subscriptions.push(
      this.chatService.userOnline$.subscribe(status => {
        this.updateUserOnlineStatus(status.userId, status.isOnline);
      })
    );

    // Subscribe to messages read
    this.subscriptions.push(
      this.chatService.messagesRead$.subscribe(data => {
        this.handleMessagesRead(data);
      })
    );

    // Subscribe to message deleted
    this.subscriptions.push(
      this.chatService.messageDeleted$.subscribe(data => {
        this.handleMessageDeleted(data);
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

  async loadConversation() {
    this.isLoading = true;

    // Join conversation room
    await this.chatService.joinConversation(this.conversationId);

    // Load messages
    this.chatService.getConversationMessages(this.conversationId, this.currentUserId).subscribe({
      next: (response) => {
        this.conversation = response;
        this.messages = response.messages;
        this.isLoading = false;
        this.scrollToBottom();
        
        // Mark as read
        this.markAsRead();
      },
      error: (error) => {
        console.error('Error loading conversation:', error);
        this.isLoading = false;
      }
    });
  }

  async sendMessage() {
    if (!this.newMessage.trim() || !this.isConnected) return;

    const content = this.newMessage.trim();
    this.newMessage = '';

    const otherUser = this.conversation.participants.find((p: any) => p.userId !== this.currentUserId);
    
    try {
      await this.chatService.sendMessage(otherUser.userId, content);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  handleNewMessage(message: Message) {
    if (message.conversationId === this.conversationId) {
      this.messages.push(message);
      this.scrollToBottom();
      
      // Mark as read if message is from other user
      if (message.senderId !== this.currentUserId) {
        this.markAsRead();
      }
    }
  }

  handleTypingIndicator(typing: any) {
    if (typing.conversationId !== this.conversationId) return;

    if (typing.isTyping) {
      this.typingUsers.set(typing.userId, typing.username);
    } else {
      this.typingUsers.delete(typing.userId);
    }
  }

  async onTyping() {
    if (!this.conversationId) return;

    // Clear existing timeout
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }

    // Send typing indicator
    await this.chatService.sendTypingIndicator(this.conversationId, true);

    // Stop typing after 2 seconds
    this.typingTimeout = setTimeout(async () => {
      await this.chatService.sendTypingIndicator(this.conversationId, false);
    }, 2000);
  }

  async markAsRead() {
    try {
      await this.chatService.markAsRead(this.conversationId);
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  }

  handleMessagesRead(data: { conversationId: number; userId: number; messageIds: number[] }) {
    if (data.conversationId !== this.conversationId) return;

    data.messageIds.forEach(messageId => {
      const message = this.messages.find(m => m.messageId === messageId);
      if (message) {
        message.isRead = true;
      }
    });
  }

  async deleteMessage(messageId: number) {
    if (confirm('Are you sure you want to delete this message?')) {
      try {
        await this.chatService.deleteMessage(messageId);
      } catch (error) {
        console.error('Error deleting message:', error);
      }
    }
  }

  handleMessageDeleted(data: { messageId: number; conversationId: number }) {
    const message = this.messages.find(m => m.messageId === data.messageId);
    if (message) {
      message.isDeleted = true;
      message.content = 'This message has been deleted';
    }
  }

  updateUserOnlineStatus(userId: number, isOnline: boolean) {
    if (this.conversation && this.conversation.participants) {
      const participant = this.conversation.participants.find((p: any) => p.userId === userId);
      if (participant) {
        participant.isOnline = isOnline;
      }
    }
  }

  getTypingText(): string {
    const names = Array.from(this.typingUsers.values());
    if (names.length === 0) return '';
    if (names.length === 1) return `${names[0]} is typing...`;
    return `${names.join(', ')} are typing...`;
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
      }
    }, 100);
  }

  formatMessageTime(date: Date): string {
    const messageDate = new Date(date);
    const now = new Date();
    const diff = now.getTime() - messageDate.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    return messageDate.toLocaleDateString();
  }

  isMyMessage(message: Message): boolean {
    return message.senderId === this.currentUserId;
  }

  goBack() {
    this.router.navigate(['/chats']);
  }

  getOtherUser() {
    if (!this.conversation || !this.conversation.participants) return null;
    return this.conversation.participants.find((p: any) => p.userId !== this.currentUserId);
  }
}