import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { AuthService } from './auth.service'; // ✅ Import AuthService
import { BehaviorSubject, Observable, Subject } from 'rxjs';

export interface Message {
  messageId: number;
  conversationId: number;
  senderId: number;
  senderUsername: string;
  senderFullName: string;
  senderAvatar: string | null;
  content: string;
  messageType: string;
  fileUrl: string | null;
  sentAt: Date;
  isEdited: boolean;
  isDeleted: boolean;
  isRead: boolean;
}

export interface Conversation {
  conversationId: number;
  otherUser: {
    userId: number;
    username: string;
    fullName: string;
    profileImageUrl: string | null;
    isOnline: boolean;
  };
  lastMessage: Message | null;
  unreadCount: number;
  lastMessageAt: Date;
  createdAt: Date;
}

export interface TypingIndicator {
  conversationId: number;
  userId: number;
  username: string;
  isTyping: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'https://localhost:7214/api/chat';
  private hubUrl = 'https://localhost:7214/chatHub';
  
  private hubConnection: HubConnection | null = null;
  private currentUserId: number | null = null;

  private messageReceivedSubject = new Subject<Message>();
  public messageReceived$ = this.messageReceivedSubject.asObservable();

  private typingSubject = new Subject<TypingIndicator>();
  public typing$ = this.typingSubject.asObservable();

  private userOnlineSubject = new Subject<{ userId: number; isOnline: boolean }>();
  public userOnline$ = this.userOnlineSubject.asObservable();

  private messagesReadSubject = new Subject<{ conversationId: number; userId: number; messageIds: number[] }>();
  public messagesRead$ = this.messagesReadSubject.asObservable();

  private messageDeletedSubject = new Subject<{ messageId: number; conversationId: number }>();
  public messageDeleted$ = this.messageDeletedSubject.asObservable();

  private connectionStateSubject = new BehaviorSubject<boolean>(false);
  public connectionState$ = this.connectionStateSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {} // ✅ Inject AuthService

  public async startConnection(userId: number): Promise<void> {
    this.currentUserId = userId;

    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${this.hubUrl}?userId=${userId}`, {
        // ✅ Provide the token to SignalR
        accessTokenFactory: () => {
          return this.authService.getCurrentToken() || '';
        }
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    this.registerSignalREvents();

    try {
      await this.hubConnection.start();
      console.log('SignalR Connected');
      this.connectionStateSubject.next(true);
    } catch (err) {
      console.error('Error connecting to SignalR:', err);
      this.connectionStateSubject.next(false);
      setTimeout(() => this.startConnection(userId), 5000);
    }

    this.hubConnection.onreconnected(() => {
      console.log('SignalR Reconnected');
      this.connectionStateSubject.next(true);
    });

    this.hubConnection.onreconnecting(() => {
      console.log('SignalR Reconnecting...');
      this.connectionStateSubject.next(false);
    });

    this.hubConnection.onclose(() => {
      console.log('SignalR Disconnected');
      this.connectionStateSubject.next(false);
    });
  }

  private registerSignalREvents(): void {
    if (!this.hubConnection) return;

    this.hubConnection.on('ReceiveMessage', (message: Message) => {
      console.log('Message received:', message);
      this.messageReceivedSubject.next(message);
    });

    this.hubConnection.on('NewMessageNotification', (message: Message) => {
      console.log('New message notification:', message);
    });

    this.hubConnection.on('UserTyping', (data: TypingIndicator) => {
      this.typingSubject.next(data);
    });

    this.hubConnection.on('UserOnline', (data: { userId: number; isOnline: boolean }) => {
      this.userOnlineSubject.next(data);
    });

    this.hubConnection.on('UserOffline', (data: { userId: number; isOnline: boolean }) => {
      this.userOnlineSubject.next(data);
    });

    this.hubConnection.on('MessagesRead', (data: any) => {
      this.messagesReadSubject.next(data);
    });

    this.hubConnection.on('MessageDeleted', (data: { messageId: number; conversationId: number }) => {
      this.messageDeletedSubject.next(data);
    });

    this.hubConnection.on('Error', (error: string) => {
      console.error('SignalR Error:', error);
    });
  }

  public async stopConnection(): Promise<void> {
    if (this.hubConnection) {
      await this.hubConnection.stop();
      this.connectionStateSubject.next(false);
    }
  }

  public async sendMessage(receiverId: number, content: string, messageType: string = 'Text', fileUrl: string | null = null): Promise<void> {
    if (this.hubConnection && this.currentUserId) {
      await this.hubConnection.invoke('SendMessage', {
        receiverId,
        content,
        messageType,
        fileUrl
      }, this.currentUserId);
    }
  }

  public async sendTypingIndicator(conversationId: number, isTyping: boolean): Promise<void> {
    if (this.hubConnection && this.currentUserId) {
      await this.hubConnection.invoke('SendTypingIndicator', conversationId, this.currentUserId, isTyping);
    }
  }

  public async markAsRead(conversationId: number): Promise<void> {
    if (this.hubConnection && this.currentUserId) {
      await this.hubConnection.invoke('MarkAsRead', conversationId, this.currentUserId);
    }
  }

  public async deleteMessage(messageId: number): Promise<void> {
    if (this.hubConnection && this.currentUserId) {
      await this.hubConnection.invoke('DeleteMessage', messageId, this.currentUserId);
    }
  }

  public async joinConversation(conversationId: number): Promise<void> {
    if (this.hubConnection) {
      await this.hubConnection.invoke('JoinConversation', conversationId);
    }
  }

  // REST API Methods
  public getConversations(userId: number): Observable<Conversation[]> {
    return this.http.get<Conversation[]>(`${this.apiUrl}/conversations/${userId}`);
  }

  public getConversationMessages(conversationId: number, userId: number, pageNumber: number = 1, pageSize: number = 50): Observable<any> {
    return this.http.get(`${this.apiUrl}/conversation/${conversationId}/messages`, {
      params: { userId: userId.toString(), pageNumber: pageNumber.toString(), pageSize: pageSize.toString() }
    });
  }

  public createOrGetConversation(currentUserId: number, participantUserId: number): Observable<Conversation> {
    return this.http.post<Conversation>(`${this.apiUrl}/conversation?currentUserId=${currentUserId}`, {
      participantUserId
    });
  }

  public getUnreadCount(userId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/unread-count/${userId}`);
  }

  public deleteConversation(conversationId: number, userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/conversation/${conversationId}?userId=${userId}`);
  }

  public searchUsers(query: string, currentUserId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/search?query=${query}&currentUserId=${currentUserId}`);
  }
}