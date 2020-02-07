export default function nonNull<T>(it: T | null | undefined): it is T {
  return !!it;
}
