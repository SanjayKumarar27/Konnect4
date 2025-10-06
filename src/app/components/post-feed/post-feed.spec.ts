import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostFeed } from './post-feed';

describe('PostFeed', () => {
  let component: PostFeed;
  let fixture: ComponentFixture<PostFeed>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PostFeed]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostFeed);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
