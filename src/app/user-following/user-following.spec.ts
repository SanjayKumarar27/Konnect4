import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFollowing } from './user-following';

describe('UserFollowing', () => {
  let component: UserFollowing;
  let fixture: ComponentFixture<UserFollowing>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserFollowing]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserFollowing);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
