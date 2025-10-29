import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatRoom } from './chat-room';

describe('ChatRoom', () => {
  let component: ChatRoom;
  let fixture: ComponentFixture<ChatRoom>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChatRoom]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatRoom);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
