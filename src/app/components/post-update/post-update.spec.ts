import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostUpdate } from './post-update';

describe('PostUpdate', () => {
  let component: PostUpdate;
  let fixture: ComponentFixture<PostUpdate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PostUpdate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostUpdate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
