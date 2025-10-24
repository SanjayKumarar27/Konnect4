import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFollwer } from './user-follwer';

describe('UserFollwer', () => {
  let component: UserFollwer;
  let fixture: ComponentFixture<UserFollwer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserFollwer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserFollwer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
